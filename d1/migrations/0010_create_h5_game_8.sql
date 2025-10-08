CREATE TABLE `h5_game` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `site_url` TEXT NOT NULL,
  `play_url` TEXT NOT NULL
);

CREATE TABLE `h5_blog_detail` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`h5_game_id` integer NOT NULL,
	`description` text,
	`instructions` text,
	`language` text,
	FOREIGN KEY (`h5_game_id`) REFERENCES `h5_game`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `h5_blog_detail_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`blog_detail_id` integer NOT NULL,
	`category` text NOT NULL,
	FOREIGN KEY (`blog_detail_id`) REFERENCES `h5_blog_detail`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `h5_blog_detail_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`blog_detail_id` integer NOT NULL,
	`image_url` text NOT NULL,
	FOREIGN KEY (`blog_detail_id`) REFERENCES `h5_blog_detail`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `h5_blog_detail_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`blog_detail_id` integer NOT NULL,
	`tag` text NOT NULL,
	FOREIGN KEY (`blog_detail_id`) REFERENCES `h5_blog_detail`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `h5_blog_page` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_index` integer NOT NULL,
	`page_url` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `h5_blog_thumbnail` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_id` integer NOT NULL,
	`title` text NOT NULL,
	`thumbnail_url` text NOT NULL,
	`blog_detail_id` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `h5_blog_page`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`blog_detail_id`) REFERENCES `h5_blog_detail`(`id`) ON UPDATE no action ON DELETE no action
);
