import { Env } from "./types";
import { requireAuth } from "./auth";
import { createCrudRoutes } from "./routes/crud";
import {StatusModel} from "./models/article/status";
import {CategoryModel} from "./models/article/category";
import {SeriesModel} from "./models/article/series";
import {JobModel} from "./models/article/job";

const statusRoutes = createCrudRoutes("statuses", StatusModel);
const categoryRoutes = createCrudRoutes("categories", CategoryModel);
const seriesRoutes = createCrudRoutes("series", SeriesModel);
const jobRoutes = createCrudRoutes("jobs", JobModel);

export default {
	async fetch(request: Request, env: Env) {
		// TODO: here
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type, Authorization",
					// TODO: handle here again, this is just temporary
					// "Access-Control-Max-Age": "86400",
				},
			});
		}
		const authError = requireAuth(request, env);
		if (authError) return authError;

		const url = new URL(request.url);
		if (url.pathname.startsWith("/article/categories")) {
			return await categoryRoutes(request, env);
		}
		if (url.pathname.startsWith("/article/series")) {
			return await seriesRoutes(request, env);
		}
		if (url.pathname.startsWith("/article/statuses")) {
			return await statusRoutes(request, env);
		}
		if (url.pathname.startsWith("/article/jobs")) {
			return await jobRoutes(request, env);
		}

		return new Response("Not Found", { status: 404 });
	},
};
