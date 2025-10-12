import { drizzle } from "drizzle-orm/d1";
import {eq, sql} from "drizzle-orm";
import type { AnySQLiteTable } from "drizzle-orm/sqlite-core";
import {
    ColumnMap, loadRelations,
    parseFilters,
    parseInclude, parsePagination,
    parseSort,
    validateData,
} from "./helper";
import { Env, ModelSchema } from "../types";
import {Hono} from "hono";

type CrudOptions<T extends AnySQLiteTable> = {
    table: T;
    columns: ColumnMap;
    schema: ModelSchema;
    buildIncludes?: (paths: string[][]) => any;
    custom?: (app: Hono, db: any) => void;
};


function withCors(res: Response, status?: number) {
    // TODO: whitelist here
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

export function createCrudRoutes<T extends AnySQLiteTable>(
    {
        table,
        columns,
        schema,
        custom,
    }: CrudOptions<T>) {
    return async (req: Request, env: Env, ctx?: any) => {
        const db = drizzle(env.D1_DATABASE, { schema });
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        const filters = parseFilters(url, columns);
        const orderBy = parseSort(url, columns);
        const { limit, page, offset } = parsePagination(url);
        const includes = parseInclude(url);
        const app = new Hono();

        try {
            // Custom
            if (custom) {
                custom(app, db);
                const res = await app.fetch(req, env, ctx);
                if (res.status !== 404) {
                    return withCors(res);
                }
            }

            // OPTIONS
            if (req.method === "OPTIONS") {
                return withCors(new Response(null, { status: 204 }));
            }

            // GET
            if (req.method === "GET") {
                const tableName = (table as any)[Symbol.for("drizzle:Name")]; // unchanged

                if (id && id !== tableName) {
                    let rows = await db
                        .select()
                        .from(table)
                        .where(eq(columns.id, Number(id)))
                        .limit(1)
                        .all();
                    if (includes.length) {
                        rows = await loadRelations(db, tableName, rows, includes);
                    }
                    return withCors(
                        Response.json(rows[0] || {}, { status: rows.length ? 200 : 404 })
                    );
                } else {
                    let rows = await db
                        .select()
                        .from(table)
                        .where(filters)
                        .orderBy(...orderBy)
                        .limit(limit)
                        .offset(offset)
                        .all();
                    if (includes.length) {
                        rows = await loadRelations(db, tableName, rows, includes);
                    }
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
                const body: any = await req.json();
                validateData(schema, body);

                // @ts-ignore
                const [row] = await db.insert(table).values(body).returning();
                return withCors(Response.json(row, { status: 201 }));
            }
            // POST /bulk 
            if (req.method === "POST" && url.pathname.endsWith("/bulk")) {
                const body: any[] = await req.json();

                if (!Array.isArray(body) || body.length === 0) {
                    return withCors(
                        Response.json({ error: "Body must be a non-empty array" }, { status: 400 })
                    );
                }

                for (const item of body) {
                    validateData(schema, item);
                }

                const rows = await db.insert(table).values(body).returning();

                return withCors(Response.json(rows, { status: 201 }));
            }

            // PATCH (Update)
            if (req.method === "PATCH") {
                if (!id) {
                    return withCors(
                        Response.json({ error: "ID required" }, { status: 400 })
                    );
                }

                const body: any = await req.json();
                validateData(schema, body, true);


                // @ts-ignore
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
