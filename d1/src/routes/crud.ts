import { Env, ModelSchema } from "../types";

export function createCrudRoutes(tableName: string, schema: ModelSchema) {

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
                if (id && id !== tableName) {
                    const row = await db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).bind(id).first();
                    if (!row) return json({ error: "Not found" }, 404);
                    return json(row);
                } else {
                    const page = Number(url.searchParams.get("page") || 1);
                    const limit = Number(url.searchParams.get("limit") || 10);
                    const offset = (page - 1) * limit;
                    const rows = await db.prepare(`SELECT * FROM ${tableName} LIMIT ? OFFSET ?`).bind(limit, offset).all();
                    return json(rows.results);
                }
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


