import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Categories
export const categories = sqliteTable("categories", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
});

// Series
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

// Jobs
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
