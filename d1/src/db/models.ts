import {
    sqliteTable,
    integer,
    text,
    AnySQLiteTable,
    SQLiteInteger,
    SQLiteText,
    SQLiteReal,
} from "drizzle-orm/sqlite-core";
import {getTableColumns, relations} from "drizzle-orm";
import {FieldSchema, ModelSchema} from "../types";
import { sql } from 'drizzle-orm';


function colToFieldType(col: any): "number" | "string" {
    if (col instanceof SQLiteInteger || col instanceof SQLiteReal) return "number";
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

export function makeSchema(table: AnySQLiteTable, tableName: string): ModelSchema {
    const columns = getTableColumns(table);
    const fields: Record<string, FieldSchema> = {};

    for (const [colName, col] of Object.entries(columns)) {
        const type: "number" | "string" = colToFieldType(col as any);

        const isNotNull = Boolean((col as any).notNull);
        const hasDefault = Boolean((col as any).hasDefault);
        const isAutoInc = Boolean((col as any).autoIncrement ?? (col as any).autoincrement);

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
export const usagag_videos = sqliteTable('usagag_videos', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    thumbnail: text('thumbnail').notNull(),
    video: text('video').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
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

/** Articles
 */
export const maquininha_articles = sqliteTable("maquininha_articles", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    link: text("link").notNull().unique(),
    thumbnail: text("thumbnail"),
    category: text("category"),
    date: text("date"),
    duration: text("duration"),
    content: text("content"),
});
export const ArticleSchema = makeSchema(maquininha_articles, "maquininha_articles");

/** Machines
 */
export const maquininha_machines = sqliteTable("maquininha_machines", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    link: text("link").notNull().unique(),
    thumbnail: text("thumbnail"),
    content: text("content"),
});
export const MachineSchema = makeSchema(maquininha_machines, "maquininha_machines");

export const tableRegistry: Record<string, any> = {
    jobs,
    series,
    categories,
    progress,
    statuses,
    maquininha_articles,
    maquininha_machines,
    usagag_videos,
    signals
};

// Note: use custom relationship here since Drizzle relationships does not work well with dynamic setup
// TODO: switch back to standard ORM relationship
export const relationMap: Record<
    string,
    Record<string, { foreignKey: string; target: string; targetKey: string; many?: boolean }>
> = {
    jobs: {
        series: {
            foreignKey: "series_id", // jobs.series_id → series.id
            target: "series",
            targetKey: "id",
        },
        progress: {
            foreignKey: "id",       // jobs.id
            target: "progress",     // progress.job_id
            targetKey: "job_id",
            many: true,             // 1 job → many progress
        },
    },
    series: {
        category: {
            foreignKey: "category_id", // series.category_id → categories.id
            target: "categories",
            targetKey: "id",
        },
        jobs: {
            foreignKey: "id",       // series.id
            target: "jobs",         // jobs.series_id
            targetKey: "series_id",
            many: true,             // 1 series → many jobs
        },
    },

    categories: {
        series: {
            foreignKey: "id",       // categories.id
            target: "series",       // series.category_id
            targetKey: "category_id",
            many: true,             // 1 category → many series
        },
    },

    progress: {
        job: {
            foreignKey: "job_id",   // progress.job_id → jobs.id
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
            foreignKey: "id",       // statuses.id
            target: "progress",     // progress.status_id
            targetKey: "status_id",
            many: true,             // 1 status → many progress
        },
    },
};
