import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import type { AnySQLiteTable } from "drizzle-orm/sqlite-core";
import {
    ColumnMap,
    parseFilters,
    parseInclude,
    parsePagination,
    parseSort,
    validateData,
} from "./helper";
import {ModelSchema} from "../types";


type CrudOptions<T extends AnySQLiteTable> = {
    table: T;
    columns: ColumnMap;
    schema: ModelSchema;
    buildIncludes?: (paths: string[][]) => any;
};

/**
 * We need this because db.query.<table>.findMany()
 * is only generated for *known tables*, not dynamic ones.
 */
const queryMap: Record<string, Function> = {
    jobs: (db: any, opts: any) => db.query.jobs.findMany(opts),
    series: (db: any, opts: any) => db.query.series.findMany(opts),
    categories: (db: any, opts: any) => db.query.categories.findMany(opts),
};

export function createCrudRoutes<T extends AnySQLiteTable>({
                                                               table,
                                                               columns,
                                                               schema,
                                                               buildIncludes,
                                                           }: CrudOptions<T>) {
    return async (req: Request, env: any) => {
        const db = drizzle(env.D1_DATABASE);
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        const filters = parseFilters(url, columns);
        const orderBy = parseSort(url, columns);
        const { limit, offset } = parsePagination(url);
        const includes = buildIncludes ? buildIncludes(parseInclude(url)) : undefined;

        try {
            // OPTIONS
            if (req.method === "OPTIONS") {
                return new Response(null, {
                    status: 204,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type,Authorization",
                    },
                });
            }

            // GET
            if (req.method === "GET") {
                const tableName = (table as any)[Symbol.for("drizzle:Name")];

                if (includes && Object.keys(includes).length && queryMap[tableName]) {
                    if (id && id !== tableName) {
                        const rows = await queryMap[tableName](db, {
                            where: eq(columns.id, Number(id)),
                            with: includes,
                            limit: 1,
                        });
                        return Response.json(rows[0] || {}, { status: rows.length ? 200 : 404 });
                    } else {
                        const rows = await queryMap[tableName](db, {
                            where: filters,
                            with: includes,
                            orderBy,
                            limit,
                            offset,
                        });
                        return Response.json({ data: rows });
                    }
                }

                if (id && id !== tableName) {
                    const rows = await db
                        .select()
                        .from(table)
                        .where(eq(columns.id, Number(id)))
                        .limit(1)
                        .all();
                    return Response.json(rows[0] || {}, { status: rows.length ? 200 : 404 });
                } else {
                    const rows = await db
                        .select()
                        .from(table)
                        .where(filters)
                        .orderBy(...orderBy)
                        .limit(limit)
                        .offset(offset)
                        .all();
                    return Response.json({ data: rows });
                }
            }

            // POST (Create)
            if (req.method === "POST") {
                const body = await req.json();
                validateData(schema, body); // <-- validate input

                const [row] = await db.insert(table).values(body).returning();
                return Response.json(row, { status: 201 });
            }

            // PATCH (Update)
            if (req.method === "PATCH") {
                if (!id) return Response.json({ error: "ID required" }, { status: 400 });

                const body = await req.json();
                validateData(schema, body);

                const [row] = await db
                    .update(table)
                    .set(body)
                    .where(eq(columns.id, Number(id)))
                    .returning();

                return row
                    ? Response.json(row)
                    : Response.json({ error: "Not found" }, { status: 404 });
            }

            // DELETE
            if (req.method === "DELETE") {
                if (!id) return Response.json({ error: "ID required" }, { status: 400 });

                await db.delete(table).where(eq(columns.id, Number(id)));
                return new Response(null, { status: 204 });
            }

            return Response.json({ error: "Method not allowed" }, { status: 405 });
        } catch (err: any) {
            // Catch both validation and DB errors
            return Response.json(
                { success: false, error: err.message || "Unknown error" },
                { status: 400 }
            );
        }
    };
}
