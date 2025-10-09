-- -------------------------- Blog Pages ----------------------------
CREATE TABLE `blog_pages` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `page_index` integer NOT NULL
);

-- index để tăng tốc JOIN
CREATE INDEX `idx_blog_pages_page_index` ON `blog_pages` (`page_index`);

-- -------------------------- Blog Details ----------------------------
CREATE TABLE `blog_details` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `slug` text NOT NULL,
  `title` text NOT NULL,
  `content` text
);

CREATE UNIQUE INDEX `blog_details_slug_unique` ON `blog_details` (`slug`);
CREATE INDEX `idx_blog_details_slug` ON `blog_details` (`slug`);
CREATE INDEX `idx_blog_details_title` ON `blog_details` (`title`);

-- -------------------------- Blog Detail Images ----------------------------
CREATE TABLE `blog_detail_images` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `blog_detail_id` integer NOT NULL,
  `image` text NOT NULL,
  FOREIGN KEY (`blog_detail_id`) REFERENCES `blog_details`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Index và composite unique để tránh trùng ảnh
CREATE INDEX `idx_blog_detail_images_detail_id` ON `blog_detail_images` (`blog_detail_id`);
CREATE UNIQUE INDEX `uix_blog_detail_images_unique` ON `blog_detail_images` (`blog_detail_id`, `image`);

-- -------------------------- Blog Detail Categories ----------------------------
CREATE TABLE `blog_detail_categories` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `blog_detail_id` integer NOT NULL,
  `category` text NOT NULL,
  FOREIGN KEY (`blog_detail_id`) REFERENCES `blog_details`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Index và composite unique để tránh trùng category trong cùng bài viết
CREATE INDEX `idx_blog_detail_categories_detail_id` ON `blog_detail_categories` (`blog_detail_id`);
CREATE INDEX `idx_blog_detail_categories_category` ON `blog_detail_categories` (`category`);
CREATE UNIQUE INDEX `uix_blog_detail_categories_unique` ON `blog_detail_categories` (`blog_detail_id`, `category`);

-- -------------------------- Blog Thumbnails ----------------------------
CREATE TABLE `blog_thumbnails` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `page_id` integer NOT NULL,
  `blog_detail_id` integer NOT NULL,
  `title` text NOT NULL,
  `excerpt` text,
  `thumbnail` text NOT NULL,
  `created_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (`page_id`) REFERENCES `blog_pages`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`blog_detail_id`) REFERENCES `blog_details`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `idx_blog_thumbnails_page_id` ON `blog_thumbnails` (`page_id`);
CREATE INDEX `idx_blog_thumbnails_detail_id` ON `blog_thumbnails` (`blog_detail_id`);
CREATE INDEX `idx_blog_thumbnails_created_at` ON `blog_thumbnails` (`created_at`);

-- -------------------------- Blog Thumbnail Tags ----------------------------
CREATE TABLE `blog_thumbnail_tag` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `blog_thumbnail_id` integer NOT NULL,
  `tag` text NOT NULL,
  FOREIGN KEY (`blog_thumbnail_id`) REFERENCES `blog_thumbnails`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `idx_blog_thumbnail_tags_thumbnail_id` ON `blog_thumbnail_tag` (`blog_thumbnail_id`);
CREATE UNIQUE INDEX `uix_blog_thumbnail_tags_unique` ON `blog_thumbnail_tag` (`blog_thumbnail_id`, `tag`);
