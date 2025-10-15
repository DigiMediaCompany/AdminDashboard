import {
  sqliteTable,
  integer,
  text,
  AnySQLiteTable,
  SQLiteInteger,
  SQLiteText,
  SQLiteReal,
  real,
} from "drizzle-orm/sqlite-core";
import { getTableColumns, relations } from "drizzle-orm";
import { FieldSchema, ModelSchema } from "../types";
import { sql } from "drizzle-orm";

function colToFieldType(col: any): "number" | "string" {
  if (col instanceof SQLiteInteger || col instanceof SQLiteReal)
    return "number";
  if (col instanceof SQLiteText) return "string";

  // Fallbacks (helpful across builds)
  const ctor = col?.constructor?.name;
  if (ctor === "SQLiteInteger" || ctor === "SQLiteReal") return "number";
  if (ctor === "SQLiteText" || ctor === "SQLiteBlob") return "string";

  // Some builds expose a dataType
  if (col?.dataType === "number" || col?.dataType === "bigint") return "number";
  if (col?.dataType === "string" || col?.dataType === "json") return "string";

  return "string";
}

export function makeSchema(
  table: AnySQLiteTable,
  tableName: string
): ModelSchema {
  const columns = getTableColumns(table);
  const fields: Record<string, FieldSchema> = {};

  for (const [colName, col] of Object.entries(columns)) {
    const type: "number" | "string" = colToFieldType(col as any);

    const isNotNull = Boolean((col as any).notNull);
    const hasDefault = Boolean((col as any).hasDefault);
    const isAutoInc = Boolean(
      (col as any).autoIncrement ?? (col as any).autoincrement
    );

    const field: FieldSchema = { type };
    if (isNotNull && !isAutoInc && !hasDefault) {
      field.required = true;
    }
    fields[colName] = field;
  }

  return { table: tableName, fields };
}

/**
 * Categories
 */
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});
export const CategorySchema = makeSchema(categories, "categories");

/**
 * Series
 */
export const series = sqliteTable("series", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category_id: integer("category_id"),
  big_context_file: text("big_context_file"),
});
export const SeriesSchema = makeSchema(series, "series");

/**
 * Usagag Videos
 */
export const usagag_videos = sqliteTable("usagag_videos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  thumbnail: text("thumbnail").notNull(),
  video: text("video").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
export const UsagagSchema = makeSchema(usagag_videos, "usagag_videos");
/**
 * Jobs
 */
export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  detail: text("detail").notNull().default("{}"),
  series_id: integer("series_id").references(() => series.id),
  episode: integer("episode"),
  priority: integer("priority").notNull().default(0),
  type: integer("type").notNull(),
});
export const JobSchema = makeSchema(jobs, "jobs");

/**
 * Statuses
 */
export const statuses = sqliteTable("statuses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: integer("type").notNull(),
  position: integer("position").notNull(),
});

export const StatusSchema = makeSchema(statuses, "statuses");

/**
 * Progress
 */
export const progress = sqliteTable("progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  status: text("status", {
    enum: ["Going", "Success", "Failed", "Standby"],
  })
    .notNull()
    .default("Standby"),
  status_id: integer("status_id")
    .notNull()
    .references(() => statuses.id),
  job_id: integer("job_id")
    .notNull()
    .references(() => jobs.id),
});

export const ProgressSchema = makeSchema(progress, "progress");

/**
 * Signals
 */
export const signals = sqliteTable("signals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  status: integer("status").notNull(),
});

export const SignalSchema = makeSchema(signals, "signals");

/**
 * Blogs
 */
export const blogs = sqliteTable("blogs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  thumbnail: text("thumbnail").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  tag: text("tag"),
  createdDate: text("createdDate").default(sql`CURRENT_TIMESTAMP`),
  content: text("content"),
});
export const BlogsSchema = makeSchema(blogs, "blogs");

/**
 * H5Games
 */
export const h5_games = sqliteTable("h5_games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceId: integer("sourceId").unique(),
  thumbnail: text("thumbnail").notNull(),
  title: text("title").notNull(),
  rating: real("rating").notNull().default(0.5),
  content: text("content"),
  tags: text("tags")
    .notNull()
    .default(
      JSON.stringify({
        language: "English",
        gender: ["Male", "Female"],
        category: ["Arcade"],
        tags: [],
      })
    ),
  gameplayLink: text("gameplayLink"),
});
export const H5GamesSchema = makeSchema(h5_games, "h5_games");

export const h5_games_tags = sqliteTable("h5_games_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull(),
  value: text("value").notNull(),
  h5GamesId: integer("h5GamesId").references(() => h5_games.id),
});
export const H5GamesTagsSchema = makeSchema(h5_games_tags, "h5_games_tags");
/**
 * AppReviews
 */
export const app_reviews = sqliteTable("app_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  description: text("description"),
  rating: real("rating").default(4.5),
  content: text("content"),
  screenshots: text("screenshots"),
  summary: text("summary"),
  circleScore: integer("circleScore").default(45),
  graphicAndSound: real("graphicAndSound").default(4.5),
  gamePlay: real("gamePlay").default(4.5),
  controls: real("controls").default(4.5),
  lastingAppeal: real("lastingAppeal").default(4.5),
  pros: text("pros").default(JSON.stringify([])),
  cons: text("cons").default(JSON.stringify([])),
  gameWebsiteLink: text("gameWebsiteLink"),
});
export const AppReviewsSchema = makeSchema(app_reviews, "app_reviews");

export const tableRegistry: Record<string, any> = {
  jobs,
  series,
  categories,
  progress,
  statuses,
  usagag_videos,
  signals,
  app_reviews,
  h5_games,
  h5_games_tags,
  blogs,
};

// Note: use custom relationship here since Drizzle relationships does not work well with dynamic setup
// TODO: switch back to standard ORM relationship
export const relationMap: Record<
  string,
  Record<
    string,
    { foreignKey: string; target: string; targetKey: string; many?: boolean }
  >
> = {
  jobs: {
    series: {
      foreignKey: "series_id", // jobs.series_id → series.id
      target: "series",
      targetKey: "id",
    },
    progress: {
      foreignKey: "id", // jobs.id
      target: "progress", // progress.job_id
      targetKey: "job_id",
      many: true, // 1 job → many progress
    },
  },
  series: {
    category: {
      foreignKey: "category_id", // series.category_id → categories.id
      target: "categories",
      targetKey: "id",
    },
    jobs: {
      foreignKey: "id", // series.id
      target: "jobs", // jobs.series_id
      targetKey: "series_id",
      many: true, // 1 series → many jobs
    },
  },

  categories: {
    series: {
      foreignKey: "id", // categories.id
      target: "series", // series.category_id
      targetKey: "category_id",
      many: true, // 1 category → many series
    },
  },

  progress: {
    job: {
      foreignKey: "job_id", // progress.job_id → jobs.id
      target: "jobs",
      targetKey: "id",
    },
    status: {
      foreignKey: "status_id", // progress.status_id → statuses.id
      target: "statuses",
      targetKey: "id",
    },
  },

  statuses: {
    progress: {
      foreignKey: "id", // statuses.id
      target: "progress", // progress.status_id
      targetKey: "status_id",
      many: true, // 1 status → many progress
    },
  },

  h5_games: {
    tags: {
      foreignKey: "id", //h5_games.id
      target: "h5_games_tags", // h5_games_tags.h5GamesId
      targetKey: "h5GamesId",
      many: true, // 1 h5_games → many tags
    },
  },
  h5_games_tags: {
    h5_games: {
      foreignKey: "h5GamesId", // h5_games.h5GamesId
      target: "h5_games",
      targetKey: "id",
    },
  },
};
