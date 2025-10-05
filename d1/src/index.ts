import {
    series,
    jobs,
    categories,
    CategorySchema,
    SeriesSchema,
    JobSchema,
    progress,
    StatusSchema,
    ProgressSchema,
    statuses,
    UsagagVideos,
    UsagagSchema,
} from "./db/models";
import {createCrudRoutes} from "./utils/crud";

import { Env } from "./types";
import {STATUS_SEED} from "./utils/constant";
import { sql } from "drizzle-orm";

const articleGroup = "/article"

const categoriesHandler = createCrudRoutes({
    table: categories,
    columns: { id: categories.id, name: categories.name },
    schema: CategorySchema,
});
const UsagagVideosHandler = createCrudRoutes({
    table: UsagagVideos,
    columns: {id: UsagagVideos.id, title: UsagagVideos.title, slug: UsagagVideos.slug, thumbnail: UsagagVideos.thumbnail, video: UsagagVideos.video },
    schema: UsagagSchema
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
            app.post(`${articleGroup}/jobs`, async (c) => {
                const body = await c.req.json();


                const [newJob] = await db
                    .insert(jobs)
                    .values({
                        detail: body.detail ?? "{}",
                        series_id: body.series_id ?? null,
                        episode: body.episode ?? null,
                        priority: body.priority ?? 0,
                        type: body.type,
                    })
                    .returning();


                const statusRows = STATUS_SEED.filter((s) => s.type === newJob.type);

                if (statusRows.length) {
                    const progressInserts = statusRows.map((s) => ({
                        job_id: newJob.id,
                        status_id: s.id,
                    }));

                    await db.insert(progress).values(progressInserts).all();
                }

                return c.json({
                    newJob,
                });
            });
        }
    },
);

const statusesHandler = createCrudRoutes({
    table: statuses,
    columns: {
        id: statuses.id,
        name: statuses.name,
        type: statuses.type,
        position: statuses.position,
    },
    schema: StatusSchema,
});

const progressHandler = createCrudRoutes({
    table: progress,
    columns: {
        id: progress.id,
        status: progress.status,
        status_id: progress.status_id,
        job_id: progress.job_id,
    },
    schema: ProgressSchema,
});


export default {
    async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(req.url);

        if (url.pathname.startsWith(`${articleGroup}/categories`)) {
            return categoriesHandler(req, env);
        }
        if (url.pathname.startsWith(`${articleGroup}/series`)) {
            return seriesHandler(req, env);
        }
        if (url.pathname.startsWith(`${articleGroup}/jobs`)) {
            return jobsHandler(req, env);
        }
        if (url.pathname.startsWith(`${articleGroup}/statuses`)) {
            return statusesHandler(req, env);
        }
        if (url.pathname.startsWith(`${articleGroup}/progress`)) {
            return progressHandler(req, env);
        }
        if (url.pathname.startsWith(`/usagag-videos`)) {
            return UsagagVideosHandler(req, env);
        }
        return new Response("Not Found", { status: 404 });
    },
};
