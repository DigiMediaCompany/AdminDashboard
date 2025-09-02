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
    const json = (data: unknown, status = 200, hit = false) =>
        // new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

        new Response(JSON.stringify(data), {
            status: status,
            headers: {
                "Content-Type": "application/json",
                // "Cache-Control": `public, max-age=${CACHE_TTL}`,
                "X-Cache": hit ? "HIT" : "MISS",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PATCH, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        })

    async function expandChildren(db: D1Database, row: any, children: ChildRelation[]) {
        for (const child of children) {
            const cols = child.columns?.join(", ") || "*";
            const res = await db
                .prepare(`SELECT ${cols} FROM ${child.table} WHERE ${child.field} = ?`)
                .bind(row.id)
                .all();

            row[child.alias || child.table] = res.results;

            if (child.children?.length) {
                for (const r of row[child.alias || child.table]) {
                    await expandChildren(db, r, child.children);
                }
            }
        }
    }


    return async (request: Request, env: Env) => {
        const db = env.D1_DATABASE;
        const url = new URL(request.url);
        const id = url.pathname.split("/").pop();

        try {
            // OPTION
            if (request.method === "OPTIONS") {
                return json({})
            }

            // GET / or GET /:id
            if (request.method === "GET") {
                const baseCols = `${tableName}.*`;
                const parentCols = parents
                    .map(
                        (r) =>
                            `${r.table}.${r.refField || "id"} AS ${r.alias || r.table}_${
                                r.refField || "id"
                            }`
                    )
                    .join(", ");
                const selectCols = [baseCols, parentCols].filter(Boolean).join(", ");

                const joins = parents
                    .map(
                        (r) =>
                            `LEFT JOIN ${r.table} ON ${tableName}.${r.field} = ${
                                r.table
                            }.${r.refField || "id"}`
                    )
                    .join(" ");

                let rows;
                if (id && id !== tableName) {
                    rows = await db
                        .prepare(
                            `SELECT ${selectCols} FROM ${tableName} ${joins} WHERE ${tableName}.id = ?`
                        )
                        .bind(id)
                        .all();
                } else {
                    const page = Number(url.searchParams.get("page") || 1);
                    const limit = Number(url.searchParams.get("limit") || 10);
                    const offset = (page - 1) * limit;
                    rows = await db
                        .prepare(
                            `SELECT ${selectCols} FROM ${tableName} ${joins} LIMIT ? OFFSET ?`
                        )
                        .bind(limit, offset)
                        .all();
                }

                const results = rows.results;

                // expand children recursively
                for (const row of results) {
                    await expandChildren(db, row, children);
                }

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


