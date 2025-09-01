import { Env } from "./types";

export function requireAuth(request: Request, env: Env) {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token || token !== env.API_TOKEN) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return null;
}