import {
  sqliteTable,
  integer,
  text,
  AnySQLiteTable,
  SQLiteInteger,
  SQLiteText,
  SQLiteReal,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
//* -------------------------- H5 Game ----------------------------------
// * BlogPage
export const blogPage = sqliteTable("h5_blog_page", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageIndex: integer("page_index").notNull(),
  pageUrl: text("page_url").notNull(),
});

// * H5Game
export const h5Game = sqliteTable("h5_game", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  siteUrl: text("site_url").notNull(),
  playUrl: text("play_url").notNull(),
});

// * BlogDetail
export const blogDetail = sqliteTable("h5_blog_detail", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  h5GameId: integer("h5_game_id")
    .notNull()
    .references(() => h5Game.id),
  description: text("description"),
  instructions: text("instructions"),
  language: text("language"),
});

// * BlogDetailImages
export const blogDetailImages = sqliteTable("h5_blog_detail_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetail.id),
  imageUrl: text("image_url").notNull(),
});

// * BlogDetailCategories
export const blogDetailCategories = sqliteTable("h5_blog_detail_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetail.id),
  category: text("category").notNull(),
});

// * BlogDetailTags
export const blogDetailTags = sqliteTable("h5_blog_detail_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetail.id),
  tag: text("tag").notNull(),
});

// * BlogThumbnail
export const blogThumbnail = sqliteTable("h5_blog_thumbnail", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageId: integer("page_id")
    .notNull()
    .references(() => blogPage.id),
  title: text("title").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetail.id),
});

// ------------------------- RELATIONS -------------------------
// page 1:n thumbnails
export const blogPageRelations = relations(blogPage, ({ many }) => ({
  thumbnails: many(blogThumbnail),
}));

// thumbnail 1: 1 page, 1 detail
export const blogThumbnailRelations = relations(blogThumbnail, ({ one }) => ({
  page: one(blogPage, {
    fields: [blogThumbnail.pageId],
    references: [blogPage.id],
  }),
  detail: one(blogDetail, {
    fields: [blogThumbnail.blogDetailId],
    references: [blogDetail.id],
  }),
}));

// detail 1: n images, n tags, n categories, 1 thumbnail, 1 h5games
export const blogDetailRelations = relations(blogDetail, ({ one, many }) => ({
  images: many(blogDetailImages),
  tags: many(blogDetailTags),
  category: many(blogDetailCategories),
  thumbnail: one(blogThumbnail),
  h5Game: one(h5Game, {
    fields: [blogDetail.h5GameId],
    references: [h5Game.id],
  }),
}));

// h5game 1:1 detail
export const h5GameRelations = relations(h5Game, ({ one }) => ({
  detail: one(blogDetail),
}));

// tags 1:1 detail
export const blogTagsRelations = relations(blogDetailTags, ({ one }) => ({
  detail: one(blogDetail, {
    fields: [blogDetailTags.blogDetailId],
    references: [blogDetail.id],
  }),
}));

// category 1:1 detail
export const blogCategoryRelations = relations(
  blogDetailCategories,
  ({ one }) => ({
    detail: one(blogDetail, {
      fields: [blogDetailCategories.blogDetailId],
      references: [blogDetail.id],
    }),
  })
);

// image n:1 detail
export const blogImageRelations = relations(blogDetailImages, ({ one }) => ({
  detail: one(blogDetail, {
    fields: [blogDetailImages.blogDetailId],
    references: [blogDetail.id],
  }),
}));
