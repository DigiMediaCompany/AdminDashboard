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
export const seriesRelations = relations(series, ({ one }) => ({
    category: one(categories, {
        fields: [series.category_id],
        references: [categories.id],
    }),
}));
export const SeriesSchema = makeSchema(series, "series");

/**
 * Jobs
 */
export const jobs = sqliteTable("jobs", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    detail: text("detail").notNull().default("{}"),
    series_id: integer("series_id"),
    episode: integer("episode"),
    priority: integer("priority").notNull().default(0),
    type: integer("type").notNull(),
});
export const jobsRelations = relations(jobs, ({ one }) => ({
    series: one(series, { fields: [jobs.series_id], references: [series.id] }),
}));
export const JobSchema = makeSchema(jobs, "jobs");
