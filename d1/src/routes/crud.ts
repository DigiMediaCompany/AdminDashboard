// src/utils/crud.ts
import { asc, desc, eq, and, inArray } from "drizzle-orm";
import type { AnySQLiteTable } from "drizzle-orm/sqlite-core";
import { parseInclude } from "./includes"; // same idea you had

type CrudOptions<TTable extends AnySQLiteTable> = {
    table: TTable;
    columns: Record<string, any>; // drizzle column refs
    buildIncludes?: (paths: string[][]) => any;
};

export function createCrudRoutes<T extends AnySQLiteTable>({
                                                               table,
                                                               columns,
                                                               buildIncludes,
                                                           }: CrudOptions<T>) {
    return async (req: Request, env: any) => {
        const db = drizzle(env.DB); // 👈 drizzle with D1
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        // parse filters
        const filters = [];
        for (const [key, value] of url.searchParams.entries()) {
            if (columns[key]) {
                if (value.includes(",")) {
                    filters.push(inArray(columns[key], value.split(",")));
                } else {
                    filters.push(eq(columns[key], value));
                }
            }
        }

        // parse order
        let orderBy: any[] = [];
        const sort = url.searchParams.get("sort");
        if (sort) {
            for (const part of sort.split(",")) {
                const descOrder = part.startsWith("-");
                const col = columns[part.replace("-", "")];
                if (col) orderBy.push(descOrder ? desc(col) : asc(col));
            }
        }

        // parse pagination
        const limit = Number(url.searchParams.get("limit") || 20);
        const offset = Number(url.searchParams.get("offset") || 0);

        // parse includes
        const includes = buildIncludes ? buildIncludes(parseInclude(url)) : undefined;

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
            if (id && id !== table._.name) {
                const rows = await db.query[table._.name].findMany({
                    where: and(eq(columns.id, Number(id)), ...filters),
                    with: includes,
                    limit: 1,
                });
                return Response.json(rows[0] || {}, { status: rows.length ? 200 : 404 });
            } else {
                const rows = await db.query[table._.name].findMany({
                    where: filters.length ? and(...filters) : undefined,
                    with: includes,
                    orderBy,
                    limit,
                    offset,
                });
                return Response.json({ data: rows });
            }
        }

        // POST
        if (req.method === "POST") {
            const body = await req.json();
            const [row] = await db.insert(table).values(body).returning();
            return Response.json(row, { status: 201 });
        }

        // PATCH
        if (req.method === "PATCH") {
            if (!id) return Response.json({ error: "ID required" }, { status: 400 });
            const body = await req.json();
            const [row] = await db
                .update(table)
                .set(body)
                .where(eq(columns.id, Number(id)))
                .returning();
            return row ? Response.json(row) : Response.json({ error: "Not found" }, { status: 404 });
        }

        // DELETE
        if (req.method === "DELETE") {
            if (!id) return Response.json({ error: "ID required" }, { status: 400 });
            await db.delete(table).where(eq(columns.id, Number(id)));
            return new Response(null, { status: 204 });
        }

        return Response.json({ error: "Method not allowed" }, { status: 405 });
    };
}
