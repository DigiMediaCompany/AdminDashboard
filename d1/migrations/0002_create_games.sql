CREATE TABLE `game_detail` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`introduction_id` integer NOT NULL,
	`url` text,
	`gameplay_description` text,
	`circle_progress` integer DEFAULT 0,
	`graphic_and_sound` integer DEFAULT 0,
	`controls` integer DEFAULT 0,
	`gameplay` integer DEFAULT 0,
	`lasting_appeal` integer DEFAULT 0,
	FOREIGN KEY (`introduction_id`) REFERENCES `game_introduction`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `game_detail_cons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_detail_id` integer NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`game_detail_id`) REFERENCES `game_detail`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `game_detail_pros` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_detail_id` integer NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`game_detail_id`) REFERENCES `game_detail`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `game_detail_screenshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_detail_id` integer NOT NULL,
	`image_url` text NOT NULL,
	FOREIGN KEY (`game_detail_id`) REFERENCES `game_detail`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `game_introduction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`thumbnail_id` integer NOT NULL,
	`url` text,
	`post_content` text,
	FOREIGN KEY (`thumbnail_id`) REFERENCES `game_thumbnail`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `game_thumbnail` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_id` integer NOT NULL,
	`title` text NOT NULL,
	`img` text NOT NULL,
	`excerpt` text,
	FOREIGN KEY (`page_id`) REFERENCES `games_page`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `games_page` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_index` integer,
	`page_url` text NOT NULL
);
