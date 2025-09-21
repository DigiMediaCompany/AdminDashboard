import {series, jobs, categories, CategorySchema, SeriesSchema, JobSchema} from "./db/models";
import {createCrudRoutes} from "./utils/crud";

import { Env } from "./types";

const categoriesHandler = createCrudRoutes({
    table: categories,
    columns: { id: categories.id, name: categories.name },
    schema: CategorySchema,
});

const seriesHandler = createCrudRoutes({
    table: series,
    columns: {
        id: series.id,
        name: series.name,
        category_id: series.category_id,
        big_context_file: series.big_context_file,
    },
    schema: SeriesSchema,
});

const jobsHandler = createCrudRoutes(
    {
        table: jobs,
        columns: {
            id: jobs.id,
            detail: jobs.detail,
            series_id: jobs.series_id,
            episode: jobs.episode,
            priority: jobs.priority,
            type: jobs.type,
        },
        schema: JobSchema,
        custom: (app, db) => {
            app.get("/custom", async (c) => {
                const [{ count }] = await db.select().from(jobs).all();
                return c.json({ totalJobs: count });
            });
        }
    },
);

export default {
    async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(req.url);

        // Basic router by path
        const articleGroup = "/article"
        if (url.pathname.startsWith(`${articleGroup}/categories`)) {
            return categoriesHandler(req, env);
        }
        if (url.pathname.startsWith(`${articleGroup}/series`)) {
            return seriesHandler(req, env);
        }
        if (url.pathname.startsWith(`${articleGroup}/jobs`)) {
            return jobsHandler(req, env);
        }

        return new Response("Not Found", { status: 404 });
    },
};
