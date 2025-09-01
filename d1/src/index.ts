import { Env } from "./types";
import { requireAuth } from "./auth";
import { createCrudRoutes } from "./routes/crud";
import {StatusModel} from "./models/status";

const statusRoutes = createCrudRoutes("statuses", StatusModel);

export default {
	async fetch(request: Request, env: Env) {
		const authError = requireAuth(request, env);
		if (authError) return authError;

		const url = new URL(request.url);
		if (url.pathname.startsWith("/statuses")) {
			return await statusRoutes(request, env);
		}

		return new Response("Not Found", { status: 404 });
	},
};
