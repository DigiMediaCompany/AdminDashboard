// import {Env} from "./types";
// import {requireAuth} from "./auth";
// import {createCrudRoutes} from "./routes/crud";
// import {StatusModel} from "./models/article/status";
// import {CategoryModel} from "./models/article/category";
// import {SeriesModel} from "./models/article/series";
// import {JobModel} from "./models/article/job";
// import {ProgressModel} from "./models/article/progress";
//
// const statusRoutes = createCrudRoutes("statuses", StatusModel);
// const categoryRoutes = createCrudRoutes("categories", CategoryModel);
// const seriesRoutes = createCrudRoutes("series", SeriesModel);
// const jobRoutes = createCrudRoutes(
//     "jobs", JobModel, [
//         {
//             table: "series",
//             field: "series_id",   // jobs.series_id → series.id
//             alias: "series"
//         }
//     ],
//     [
//         {
//             table: "progress",
//             field: "job_id",      // progress.job_id → jobs.id
//             alias: "progress",
//             // children: [
//             // 	{
//             // 		table: "statuses",
//             // 		field: "id",          // statuses.id ← progress.status_id
//             // 		refField: "status_id",// tell it to match progress.status_id → statuses.id
//             // 		alias: "step",
//             // 	},
//             // ]
//         },
//     ]);
//
// async function customJobRoutes(request: Request, env: Env) {
//     const url = new URL(request.url);
//     if (request.method === "POST" && url.pathname === "/article/jobs") {
//         const db = env.D1_DATABASE;
//         const data = await request.json();
//
//         // Step 1: Insert job
//         const cols = Object.keys(data).join(",");
//         const vals = Object.values(data);
//         const placeholders = vals.map(() => "?").join(",");
//
//         await db
//             .prepare(`INSERT INTO jobs (${cols})
//                       VALUES (${placeholders})`)
//             .bind(...vals)
//             .run();
//
//         // Step 2: Get the highest job id
//         const jobRow = await db.prepare(
//             `SELECT MAX(id) as id FROM jobs`
//         ).all();
//         const jobId = jobRow.results[0]?.id;
//
//         if (!jobId) {
//             return new Response(
//                 JSON.stringify({error: "Failed to fetch job id"}),
//                 {status: 500}
//             );
//         }
//
//         // Step 3: Get statuses of type 'article'
//         const statuses = await db
//             .prepare(`SELECT id
//                       FROM statuses
//                       WHERE type = ?
//                       ORDER BY position ASC`)
//             .bind(data.type)
//             .all();
//
//         // Step 4: Insert progress rows for each status
//         for (const s of statuses.results) {
//             await db
//                 .prepare(
//                     `INSERT INTO progress (status, status_id, job_id)
//                      VALUES (?, ?, ?)`
//                 )
//                 .bind("Standby", s.id, jobId)
//                 .run();
//         }
//
//         // Step 5: Return the new job with its progresses
//         const jobWithProgress = await db
//             .prepare(
//                 `SELECT jobs.*
//                  FROM jobs
//                  WHERE jobs.id = ?`
//             )
//             .bind(jobId)
//             .all();
//
//         return new Response(JSON.stringify(jobWithProgress.results[0]), {
//             status: 201,
//             headers: {
//                 "Content-Type": "application/json",
//                 "Access-Control-Allow-Origin": "*",
//                 "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PATCH, DELETE",
//                 "Access-Control-Allow-Headers": "Content-Type, Authorization"
//             },
//         });
//     }
//
//     // ✅ Default CRUD for everything else
//     return jobRoutes(request, env);
// }
//
// const progressRoutes = createCrudRoutes("progress", ProgressModel);
//
// export default {
//     async fetch(request: Request, env: Env) {
//         // TODO: here
//         if (request.method === "OPTIONS") {
//             return new Response(null, {
//                 status: 204,
//                 headers: {
//                     "Access-Control-Allow-Origin": "*",
//                     "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
//                     "Access-Control-Allow-Headers": "Content-Type, Authorization",
//                     // TODO: handle here again, this is just temporary
//                     // "Access-Control-Max-Age": "86400",
//                 },
//             });
//         }
//         const authError = requireAuth(request, env);
//         if (authError) return authError;
//
//         const url = new URL(request.url);
//         if (url.pathname.startsWith("/article/categories")) {
//             return await categoryRoutes(request, env);
//         }
//         if (url.pathname.startsWith("/article/series")) {
//             return await seriesRoutes(request, env);
//         }
//         if (url.pathname.startsWith("/article/statuses")) {
//             return await statusRoutes(request, env);
//         }
//         if (url.pathname.startsWith("/article/jobs")) {
//             return await customJobRoutes(request, env);
//         }
//         if (url.pathname.startsWith("/article/progress")) {
//             return await progressRoutes(request, env);
//         }
//
//         return new Response("Not Found", {status: 404});
//     },
// };


import { Hono } from "hono";
import { categories, series, jobs } from "./db/models";
import { createCrudRoutes } from "./utils/crud";

const app = new Hono();

// categories
const categoriesHandler = createCrudRoutes({
    table: categories,
    columns: { id: categories.id, name: categories.name },
});
app.all("/categories/*", (c) => categoriesHandler(c.req.raw, c.env));

// series
const seriesHandler = createCrudRoutes({
    table: series,
    columns: {
        id: series.id,
        name: series.name,
        category_id: series.category_id,
        big_context_file: series.big_context_file,
    },
    buildIncludes: (paths) => {
        const withObj: any = {};
        for (const p of paths) {
            if (p[0] === "category") withObj.category = true;
        }
        return withObj;
    },
});
app.all("/series/*", (c) => seriesHandler(c.req.raw, c.env));

// jobs
const jobsHandler = createCrudRoutes({
    table: jobs,
    columns: {
        id: jobs.id,
        detail: jobs.detail,
        series_id: jobs.series_id,
        episode: jobs.episode,
        priority: jobs.priority,
        type: jobs.type,
    },
    buildIncludes: (paths) => {
        const withObj: any = {};
        for (const p of paths) {
            if (p[0] === "series") withObj.series = true;
        }
        return withObj;
    },
});
app.all("/jobs/*", (c) => jobsHandler(c.req.raw, c.env));

export default app;