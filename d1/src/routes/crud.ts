import { Env, ModelSchema } from "../types";

type Relation = {
    field: string;    // FK in this table
    table: string;    // parent table
    refField?: string;
    alias?: string;
};

type ChildRelation = {
    table: string;       // child table
    field: string;       // FK in child table
    alias?: string;
    refField?: string;
    columns?: string[];
    children?: ChildRelation[]; // 👈 nested children
};

export function createCrudRoutes(tableName: string, schema: ModelSchema, parents: Relation[] = [],
                                 children: ChildRelation[] = []) {

    // TODO: add auth
    // TODO: CORS, rate limit, throttle, black/white list
    // TODO: injection
    // TODO: add clear cache by handling cache manually, add cache handling
    const json = (data: unknown = null, status = 200, hit = false) => {
        const baseHeaders: Record<string, string> = {
            "X-Cache": hit ? "HIT" : "MISS",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PATCH, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        if (data === null || data === undefined) {
            return new Response(null, { status, headers: baseHeaders });
        }

        return new Response(JSON.stringify(data), {
            status,
            headers: {
                ...baseHeaders,
                "Content-Type": "application/json",
            },
        });
    };

    async function expandChildren(db: D1Database, rows: any[], children: ChildRelation[]) {
        if (!children.length || !rows.length) return;

        for (const child of children) {
            const parentIds = rows.map((r) => r.id).filter(Boolean);
            if (!parentIds.length) continue;

            const cols = child.columns?.join(", ") || "*";

            // query all children at once
            const placeholders = parentIds.map(() => "?").join(",");
            const res = await db
                .prepare(`SELECT ${cols}, ${child.field} as _parent_id FROM ${child.table} WHERE ${child.field} IN (${placeholders})`)
                .bind(...parentIds)
                .all();

            const childRows = res.results;

            // attach children back to their parents
            for (const row of rows) {
                row[child.alias || child.table] = childRows.filter(
                    (c) => c._parent_id === row.id
                );
            }

            // recursively expand nested children
            if (child.children?.length) {
                for (const row of rows) {
                    await expandChildren(db, row[child.alias || child.table], child.children);
                }
            }
        }
    }

    async function buildParentSelect(db: D1Database, parent: Relation) {
        // get all columns from parent table
        const tableInfo = await db.prepare(`PRAGMA table_info(${parent.table})`).all();
        // alias each column as parentAlias_columnName
        const alias = parent.alias || parent.table;
        return tableInfo.results
            .map((col: any) => `${parent.table}.${col.name} AS ${alias}_${col.name}`)
            .join(", ");
    }

    function expandParents(row: any, parents: Relation[]) {
        for (const parent of parents) {
            const alias = parent.alias || parent.table;
            const obj: Record<string, any> = {};
            for (const key in row) {
                if (key.startsWith(alias + "_")) {
                    obj[key.replace(alias + "_", "")] = row[key];
                    delete row[key];
                }
            }
            row[alias] = obj;
        }
    }


    return async (request: Request, env: Env) => {
        const db = env.D1_DATABASE;
        const url = new URL(request.url);
        const id = url.pathname.split("/").pop();

        try {
            // OPTION
            if (request.method === "OPTIONS") {
                return json()
            }

            // GET / or GET /:id
            if (request.method === "GET") {
                // Build parent columns dynamically
                const parentColsArr: string[] = [];
                for (const parent of parents) {
                    const cols = await buildParentSelect(db, parent);
                    parentColsArr.push(cols);
                }

                const selectCols = [`${tableName}.*`, ...parentColsArr]
                    .filter(Boolean)
                    .join(", ");

                // LEFT JOIN parents
                const joins = parents
                    .map(
                        (r) =>
                            `LEFT JOIN ${r.table} AS ${r.alias || r.table} 
         ON ${tableName}.${r.field} = ${r.alias || r.table}.${r.refField || "id"}`
                    )
                    .join(" ");

                let rows;
                if (id && id !== tableName) {
                    rows = await db
                        .prepare(
                            `SELECT ${selectCols}
                             FROM ${tableName} ${joins}
                             WHERE ${tableName}.id = ?
                             ORDER BY ${tableName}.id DESC`
                        )
                        .bind(id)
                        .all();
                } else {
                    const page = Number(url.searchParams.get("page") || 1);
                    const limit = Number(url.searchParams.get("limit") || 10);
                    const offset = (page - 1) * limit;

                    rows = await db
                        .prepare(
                            `SELECT ${selectCols}
                             FROM ${tableName} ${joins}
                             ORDER BY ${tableName}.id DESC
                                 LIMIT ? OFFSET ?`
                        )
                        .bind(limit, offset)
                        .all();
                }

                const results = rows.results;

                // Expand parents
                for (const row of results) {
                    expandParents(row, parents);
                }

                // Expand children in batches (avoids N+1)
                await expandChildren(db, results, children);

                if (id && id !== tableName) {
                    return json(results[0] || {}, results.length ? 200 : 404);
                }

                return json(results);
            }

            // POST
            if (request.method === "POST") {
                const data: object = await request.json();
                for (const key of Object.keys(schema)) {
                    const field = schema[key];
                    if (key === "id") continue;
                    if (typeof field === "object" && field.optional) continue;
                    if (!(key in data)) return json({ error: `${key} is required` }, 400);
                }
                const cols = Object.keys(data).join(",");
                const vals = Object.values(data);
                const placeholders = vals.map(() => "?").join(",");
                const res = await db.prepare(`INSERT INTO ${tableName} (${cols}) VALUES (${placeholders})`).bind(...vals).run();
                return json(res);
            }

            // PATCH /:id
            if (request.method === "PATCH") {
                if (!id) return json({ error: "ID required" }, 400);
                const data = await request.json();
                const keys = Object.keys(data).filter((k) => k in schema && k !== "id");
                if (!keys.length) return json({ error: "No valid fields to update" }, 400);
                const setString = keys.map((k) => `${k} = ?`).join(",");
                const values = keys.map((k) => data[k]);
                await db.prepare(`UPDATE ${tableName} SET ${setString} WHERE id = ?`).bind(...values, id).run();
                return json({ success: true });
            }

            // DELETE /:id
            if (request.method === "DELETE") {
                if (!id) return json({ error: "ID required" }, 400);
                await db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).bind(id).run();
                return json({ success: true });
            }

            return json({ error: "Method not allowed" }, 405);
        } catch (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return json({ error: "Unique constraint violation", detail: err.message }, 400);
            }
            if (err.message.includes("FOREIGN KEY constraint failed")) {
                return json({ error: "Foreign key constraint violation", detail: err.message }, 400);
            }
            // Default catch-all
            return json({ error: "Database error", detail: err.message }, 400);
        }
    };
}


