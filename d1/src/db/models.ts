import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import {getTableColumns, relations} from "drizzle-orm";
import {FieldSchema, ModelSchema} from "../types";

function makeSchema(table: any, tableName: string): ModelSchema {
    const cols = getTableColumns(table);
    const fields: Record<string, FieldSchema> = {};

    for (const [colName, col] of Object.entries(cols)) {
        // Drizzle column type detection
        const colType = (col as any).columnType as string;

        let field: FieldSchema = { type: "string" };

        if (colType.includes("integer")) {
            field = { type: "number" };
        } else if (colType.includes("text")) {
            field = { type: "string" };
        }

        // required if .notNull() was applied
        if ((col as any).notNull) {
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