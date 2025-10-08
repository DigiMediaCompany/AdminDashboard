import {
  sqliteTable,
  integer,
  text,
  AnySQLiteTable,
  SQLiteInteger,
  SQLiteText,
  SQLiteReal,
} from "drizzle-orm/sqlite-core";

// * -------------------------- News ----------------------------
// * BlogPage
export const blogPages = sqliteTable("blog_pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageIndex: integer("page_index").notNull(), // số thứ tự trang
});

// * BlogDetail
export const blogDetails = sqliteTable("blog_details", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  content: text("content"),
});

// * BlogDetailImages
export const blogDetailImages = sqliteTable("blog_detail_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetails.id),
  imageUrl: text("image_url").notNull(),
});

// * BlogDetailCategories
export const blogDetailCategories = sqliteTable("blog_detail_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetails.id),
  category: text("category").notNull(),
});

// * BlogThumbnail
export const blogThumbnails = sqliteTable("blog_thumbnails", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageId: integer("page_id")
    .notNull()
    .references(() => blogPages.id),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetails.id),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  createdAt: text("created_at").notNull(),
});

// * BlogThumbnailTags
export const blogThumbnailTags = sqliteTable("blog_thumbnail_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogThumbnailId: integer("blog_thumbnail_id")
    .notNull()
    .references(() => blogThumbnails.id),
  tag: text("tag").notNull(),
});
// * -------------------------- END News ----------------------------
