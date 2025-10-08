import {
  sqliteTable,
  integer,
  text,
  AnySQLiteTable,
  SQLiteInteger,
  SQLiteText,
  SQLiteReal,
} from "drizzle-orm/sqlite-core";
//* -------------------------- H5 Game ----------------------------------
// * BlogPage
export const blogPage = sqliteTable("blog_page", {
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
export const blogDetail = sqliteTable("blog_detail", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  h5GameId: integer("h5_game_id")
    .notNull()
    .references(() => h5Game.id),
  description: text("description"),
  instructions: text("instructions"),
  language: text("language"),
});

// * BlogDetailImages
export const blogDetailImages = sqliteTable("blog_detail_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetail.id),
  imageUrl: text("image_url").notNull(),
});

// * BlogDetailCategories
export const blogDetailCategories = sqliteTable("blog_detail_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetail.id),
  category: text("category").notNull(),
});

// * BlogDetailTags
export const blogDetailTags = sqliteTable("blog_detail_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetail.id),
  tag: text("tag").notNull(),
});

// * BlogDetailGenders
export const blogDetailGenders = sqliteTable("blog_detail_genders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetail.id),
  gender: text("gender").notNull(),
});

// * BlogThumbnail
export const blogThumbnail = sqliteTable("blog_thumbnail", {
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

// * -------------------------- END H5Game -------------------------
