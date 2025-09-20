import { drizzle } from "drizzle-orm/d1";
import {eq, sql} from "drizzle-orm";
import type { AnySQLiteTable } from "drizzle-orm/sqlite-core";
import {
    ColumnMap,
    parseFilters,
    parseInclude, parsePagination,
    parseSort,
    validateData,
} from "./helper";
import { Env, ModelSchema } from "../types";

type CrudOptions<T extends AnySQLiteTable> = {
    table: T;
    columns: ColumnMap;
    schema: ModelSchema;
    buildIncludes?: (paths: string[][]) => any;
};


/**
 * Always return CORS headers
 */
function withCors(res: Response, status?: number) {
    const headers = new Headers(res.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
    headers.set("Access-Control-Allow-Credentials", "true");
    return new Response(res.body, {
        status: status ?? res.status,
        headers,
    });
}

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
    return async (req: Request, env: Env) => {
        const db = drizzle(env.D1_DATABASE, { schema });
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        const filters = parseFilters(url, columns);
        const orderBy = parseSort(url, columns);
        const { limit, page, offset } = parsePagination(url);
        const includes = buildIncludes ? buildIncludes(parseInclude(url)) : undefined;

        try {
            // OPTIONS
            if (req.method === "OPTIONS") {
                return withCors(new Response(null, { status: 204 }));
            }

            // GET
            if (req.method === "GET") {
                const tableName = (table as any)[Symbol.for("drizzle:Name")];

                console.log(includes)
                if (includes && Object.keys(includes).length && queryMap[tableName]) {
                    if (id && id !== tableName) {
                        const rows = await queryMap[tableName](db, {
                            where: eq(columns.id, Number(id)),
                            with: includes,
                            limit: 1,
                        });
                        return withCors(
                            Response.json(rows[0] || {}, { status: rows.length ? 200 : 404 })
                        );
                    } else {
                        const rows = await queryMap[tableName](db, {
                            where: filters,
                            with: includes,
                            orderBy,
                            limit,
                            offset,
                        });
                        return withCors(
                            Response.json({
                                data: rows,
                                pagination: { page, limit, count: rows.length },
                            })
                        );
                    }
                }


                if (id && id !== tableName) {
                    const rows = await db
                        .select()
                        .from(table)
                        .where(eq(columns.id, Number(id)))
                        .limit(1)
                        .all();
                    return withCors(
                        Response.json(rows[0] || {}, { status: rows.length ? 200 : 404 })
                    );
                } else {
                    const rows = await db
                        .select()
                        .from(table)
                        .where(filters)
                        .orderBy(...orderBy)
                        .limit(limit)
                        .offset(offset)
                        .all();
                    const [{ count }] = await db
                        .select({ count: sql<number>`count(*)`.as("count") })
                        .from(table)
                        .where(filters)
                        .all();

                    const totalItems = count ?? 0;
                    const totalPages = Math.ceil(totalItems / limit);
                    return withCors(
                        Response.json({
                            data: rows,
                            current_page: page,
                            total_pages: totalPages,
                            total_items: totalItems,
                            per_page: limit,
                        })
                    );
                }
            }

            // POST (Create)
            if (req.method === "POST") {
                const body = await req.json();
                validateData(schema, body);

                const [row] = await db.insert(table).values(body).returning();
                return withCors(Response.json(row, { status: 201 }));
            }

            // PATCH (Update)
            if (req.method === "PATCH") {
                if (!id) {
                    return withCors(
                        Response.json({ error: "ID required" }, { status: 400 })
                    );
                }

                const body = await req.json();
                validateData(schema, body, true);

                const [row] = await db
                    .update(table)
                    .set(body)
                    .where(eq(columns.id, Number(id)))
                    .returning();

                return withCors(
                    row
                        ? Response.json(row)
                        : Response.json({ error: "Not found" }, { status: 404 })
                );
            }

            // DELETE
            if (req.method === "DELETE") {
                if (!id) {
                    return withCors(
                        Response.json({ error: "ID required" }, { status: 400 })
                    );
                }

                await db.delete(table).where(eq(columns.id, Number(id)));
                return withCors(new Response(null, { status: 204 }));
            }

            return withCors(
                Response.json({ error: "Method not allowed" }, { status: 405 })
            );
        } catch (err: any) {
            return withCors(
                Response.json(
                    { success: false, error: err.message || "Unknown error" },
                    { status: 400 }
                )
            );
        }
    };
}
