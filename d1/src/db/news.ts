import { relations, sql } from "drizzle-orm";
import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";

// -------------------------- Blog Pages ----------------------------
export const blogPages = sqliteTable("blog_pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageIndex: integer("page_index").notNull(),
});

// -------------------------- Blog Details ----------------------------
export const blogDetails = sqliteTable("blog_details", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content"),
});
// index phục vụ truy vấn nhanh theo slug và search theo title
export const idxBlogDetailsSlug = index("idx_blog_details_slug").on(
  blogDetails.slug
);
export const idxBlogDetailsTitle = index("idx_blog_details_title").on(
  blogDetails.title
);

// -------------------------- Blog Detail Images ----------------------------
export const blogDetailImages = sqliteTable("blog_detail_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetails.id, { onDelete: "cascade" }),
  image: text("image").notNull(),
});
export const idxBlogDetailImagesDetail = index(
  "idx_blog_detail_images_detail_id"
).on(blogDetailImages.blogDetailId);

// -------------------------- Blog Detail Categories ----------------------------
export const blogDetailCategories = sqliteTable("blog_detail_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetails.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
});
export const idxBlogDetailCategoriesDetail = index(
  "idx_blog_detail_categories_detail_id"
).on(blogDetailCategories.blogDetailId);
export const idxBlogDetailCategoriesCategory = index(
  "idx_blog_detail_categories_category"
).on(blogDetailCategories.category);

// -------------------------- Blog Thumbnails ----------------------------
export const blogThumbnails = sqliteTable("blog_thumbnails", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageId: integer("page_id")
    .notNull()
    .references(() => blogPages.id, { onDelete: "cascade" }),
  blogDetailId: integer("blog_detail_id")
    .notNull()
    .references(() => blogDetails.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  thumbnail: text("thumbnail").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
// index phục vụ JOIN, filter, sort
export const idxBlogThumbnailsPage = index("idx_blog_thumbnails_page_id").on(
  blogThumbnails.pageId
);
export const idxBlogThumbnailsDetail = index(
  "idx_blog_thumbnails_detail_id"
).on(blogThumbnails.blogDetailId);
export const idxBlogThumbnailsCreated = index(
  "idx_blog_thumbnails_created_at"
).on(blogThumbnails.createdAt);

// -------------------------- Blog Thumbnail Tags ----------------------------
export const blogThumbnailTags = sqliteTable("blog_thumbnail_tag", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogThumbnailId: integer("blog_thumbnail_id")
    .notNull()
    .references(() => blogThumbnails.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});
export const idxBlogThumbnailTagsThumbnail = index(
  "idx_blog_thumbnail_tags_thumbnail_id"
).on(blogThumbnailTags.blogThumbnailId);

// * Relations
// --- page 1:n thumbnail
export const pageRelations = relations(blogPages, ({ one, many }) => ({
  thumbnails: many(blogThumbnails),
}));
// --- thumbnail 1:1 detail, n tag
export const thumbnailRelations = relations(
  blogThumbnails,
  ({ one, many }) => ({
    page: one(blogPages, {
      fields: [blogThumbnails.pageId],
      references: [blogPages.id],
    }),
    detail: one(blogDetails, {
      fields: [blogThumbnails.blogDetailId],
      references: [blogDetails.id],
    }),
    tags: many(blogThumbnailTags),
  })
);
// --- detail 1:n categories, n images
export const detailRelations = relations(blogDetails, ({ one, many }) => ({
  thumbnail: one(blogThumbnails),
  categories: many(blogDetailCategories),
  images: many(blogDetailImages),
}));
// --- categories 1:1 detail
export const categoriesRelations = relations(
  blogDetailCategories,
  ({ one, many }) => ({
    detail: one(blogDetails, {
      fields: [blogDetailCategories.blogDetailId],
      references: [blogDetails.id],
    }),
  })
);
// --- images 1:1 detail
export const imagesRelations = relations(blogDetailImages, ({ one, many }) => ({
  detail: one(blogDetails, {
    fields: [blogDetailImages.blogDetailId],
    references: [blogDetails.id],
  }),
}));

// --- tag 1:1 thumbnail
export const tagsRelations = relations(blogThumbnailTags, ({ one, many }) => ({
  thumbnail: one(blogThumbnails, {
    fields: [blogThumbnailTags.blogThumbnailId],
    references: [blogThumbnails.id],
  }),
}));
