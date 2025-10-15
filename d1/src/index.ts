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
  usagag_videos,
  UsagagSchema,
  signals,
  SignalSchema,
  blogs,
  BlogsSchema,
  h5_games,
  H5GamesSchema,
  h5_games_tags,
  H5GamesTagsSchema,
  app_reviews,
  AppReviewsSchema,
} from "./db/models";
import { createCrudRoutes } from "./utils/crud";

import { Env } from "./types";
import { STATUS_SEED } from "./utils/constant";
import { sql } from "drizzle-orm";

const articleGroup = "/article";
const categoriesHandler = createCrudRoutes({
  table: categories,
  columns: { id: categories.id, name: categories.name },
  schema: CategorySchema,
});
const usagagVideosHandler = createCrudRoutes({
  table: usagag_videos,
  columns: {
    id: usagag_videos.id,
    title: usagag_videos.title,
    slug: usagag_videos.slug,
    thumbnail: usagag_videos.thumbnail,
    video: usagag_videos.video,
  },
  schema: UsagagSchema,
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
  },
});

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

const signalHandler = createCrudRoutes({
  table: signals,
  columns: {
    id: signals.id,
    status: signals.status,
  },
  schema: SignalSchema,
});

/**
 * H5 Games Handler
 */
const h5GamesHandler = createCrudRoutes({
  table: h5_games,
  columns: {
    id: h5_games.id,
    sourceId: h5_games.sourceId,
    thumbnail: h5_games.thumbnail,
    title: h5_games.title,
    rating: h5_games.rating,
    content: h5_games.content,
    tags: h5_games.tags,
    gameplayLink: h5_games.gameplayLink,
  },
  schema: H5GamesSchema,
});

/**
 * H5 Games Tags
 */
const h5GamesTagsHandler = createCrudRoutes({
  table: h5_games_tags,
  columns: {
    id: h5_games_tags.id,
    key: h5_games_tags.key,
    value: h5_games_tags.value,
    h5GamesId: h5_games_tags.h5GamesId,
  },
  schema: H5GamesTagsSchema,
});

/**
 * Blogs Handler
 */
const blogsHandler = createCrudRoutes({
  table: blogs,
  columns: {
    id: blogs.id,
    slug: blogs.slug,
    thumbnail: blogs.thumbnail,
    title: blogs.title,
    description: blogs.description,
    tag: blogs.tag,
    createdDate: blogs.createdDate,
    content: blogs.content,
  },
  schema: BlogsSchema,
});

/**
 * App Reviews
 */
const appReviewsHandler = createCrudRoutes({
  table: app_reviews,
  columns: {
    id: app_reviews.id,
    slug: app_reviews.slug,
    title: app_reviews.title,
    thumbnail: app_reviews.thumbnail,
    description: app_reviews.description,
    rating: app_reviews.rating,
    content: app_reviews.content,
    screenshots: app_reviews.screenshots,
    summary: app_reviews.summary,
    circleScore: app_reviews.circleScore,
    graphicAndSound: app_reviews.graphicAndSound,
    gamePlay: app_reviews.gamePlay,
    controls: app_reviews.controls,
    lastingAppeal: app_reviews.lastingAppeal,
    pros: app_reviews.pros,
    cons: app_reviews.cons,
    gameWebsiteLink: app_reviews.gameWebsiteLink,
  },
  schema: AppReviewsSchema,
});

export default {
  async fetch(
    req: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
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
      return usagagVideosHandler(req, env);
    }
    if (url.pathname.startsWith(`${articleGroup}/signals`)) {
      return signalHandler(req, env);
    }

    if (url.pathname.startsWith(`/blogs`)) {
      return blogsHandler(req, env);
    }
    if (url.pathname.startsWith(`/h5-game`)) {
      return h5GamesHandler(req, env);
    }
    if (url.pathname.startsWith(`/appreviews`)) {
      return appReviewsHandler(req, env);
    }
    return new Response("Not Found", { status: 404 });
  },
};
