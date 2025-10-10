import { relations } from "drizzle-orm";
import {
  sqliteTable,
  integer,
  text,
  AnySQLiteTable,
  SQLiteInteger,
  SQLiteText,
  SQLiteReal,
} from "drizzle-orm/sqlite-core";

//* ------------------------ GAMES ---------------------------

// * GamePage
export const gamesPage = sqliteTable("games_page", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageIndex: integer("page_index"),
  pageUrl: text("page_url").notNull(),
});

// * GameThumbnail
export const gameThumbnail = sqliteTable("game_thumbnail", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageId: integer("page_id")
    .notNull()
    .references(() => gamesPage.id),
  title: text("title").notNull(),
  img: text("img").notNull(),
  excerpt: text("excerpt"),
});

// * GameIntroduction
export const gameIntroduction = sqliteTable("game_introduction", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  thumbnailId: integer("thumbnail_id")
    .notNull()
    .references(() => gameThumbnail.id),
  url: text("url"),
  postContent: text("post_content"),
});

// * GameDetail
export const gameDetail = sqliteTable("game_detail", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  introductionId: integer("introduction_id")
    .notNull()
    .references(() => gameIntroduction.id),
  url: text("url"),
  gameplayDescription: text("gameplay_description"),
  circleProgress: integer("circle_progress").default(0), // value / 50
  graphicAndSound: integer("graphic_and_sound").default(0), // value / 5
  controls: integer("controls").default(0), // value / 5
  gameplay: integer("gameplay").default(0), // value / 5
  lastingAppeal: integer("lasting_appeal").default(0), // value / 5
});

// * GameDetailScreenshots
export const gameDetailScreenshots = sqliteTable("game_detail_screenshots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameDetailId: integer("game_detail_id")
    .notNull()
    .references(() => gameDetail.id),
  imageUrl: text("image_url").notNull(),
});

// * GameDetailPros
export const gameDetailPros = sqliteTable("game_detail_pros", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameDetailId: integer("game_detail_id")
    .notNull()
    .references(() => gameDetail.id),
  text: text("text").notNull(),
});

// * GameDetailCons
export const gameDetailCons = sqliteTable("game_detail_cons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameDetailId: integer("game_detail_id")
    .notNull()
    .references(() => gameDetail.id),
  text: text("text").notNull(),
});
//* -------------------------- END Games ------------------------------

// * Relations
// * page 1:n thumbnail
export const gamesPageRelations = relations(gamesPage, ({ many }) => ({
  thumbnails: many(gameThumbnail),
}));

// * thumbnail 1: 1 page, 1 introduction
export const gameThumbnailRelations = relations(
  gameThumbnail,
  ({ one, many }) => ({
    page: one(gamesPage, {
      fields: [gameThumbnail.pageId],
      references: [gamesPage.id],
    }),
    introduction: one(gameIntroduction),
  })
);

// * introduction 1:1 thumbnail, 1 detail
export const gameIntroductionRelations = relations(
  gameIntroduction,
  ({ one, many }) => ({
    thumbnail: one(gameThumbnail, {
      fields: [gameIntroduction.thumbnailId],
      references: [gameThumbnail.id],
    }),
    detail: one(gameDetail),
  })
);

// * detail 1: 1 introduction, n screenshots, n pros, n cons
export const gameDetailRelations = relations(gameDetail, ({ one, many }) => ({
  introduction: one(gameIntroduction, {
    fields: [gameDetail.introductionId],
    references: [gameIntroduction.id],
  }),
  screenshots: many(gameDetailScreenshots),
  pros: many(gameDetailPros),
  cons: many(gameDetailCons),
}));

// * ... 1:1 detail
export const gameDetailScreenshotsRelations = relations(
  gameDetailScreenshots,
  ({ one }) => ({
    detail: one(gameDetail, {
      fields: [gameDetailScreenshots.gameDetailId],
      references: [gameDetail.id],
    }),
  })
);

export const gameDetailProsRelations = relations(gameDetailPros, ({ one }) => ({
  detail: one(gameDetail, {
    fields: [gameDetailPros.gameDetailId],
    references: [gameDetail.id],
  }),
}));

export const gameDetailConsRelations = relations(gameDetailCons, ({ one }) => ({
  detail: one(gameDetail, {
    fields: [gameDetailCons.gameDetailId],
    references: [gameDetail.id],
  }),
}));
