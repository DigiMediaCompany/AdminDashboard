import { Hono } from "hono";
import { GameService } from "../services/games.service";
type Bindings = {
  DB: D1Database;
};
export const gamesRoutes = new Hono<{ Bindings: Bindings }>();

// * GET /api/games -> get all pages
gamesRoutes.get("/pages", async (c) => {
  const service = new GameService(c.get("db"));
  const pages = await service.getGamePages();
  return c.json(pages);
});

// * GET /api/games/thumbnails -> get all thumbs
gamesRoutes.get("/thumbnails", async (c) => {
  const service = new GameService(c.get("db"));
  const thumbs = await service.getThumbs();
  return c.json(thumbs);
});

// * GET /api/games/introductions -> get all introductions
gamesRoutes.get("/introductions", async (c) => {
  const service = new GameService(c.get("db"));
  const intros = await service.getIntroductions();
  return c.json(intros);
});

// * GET /api/games/details -> get all details
gamesRoutes.get("/details", async (c) => {
  const service = new GameService(c.get("db"));
  const details = await service.getDetails();
  return c.json(details);
});

// * GET /api/games/page/:pageId/thumbnail -> get thumbnails from page id
gamesRoutes.get("/page/:pageId/thumbnails", async (c) => {
  const service = new GameService(c.get("db"));
  const pageId = Number(c.req.param("pageId"));

  if (!(await service.getGamePageById(pageId)))
    return c.json({ error: "Page not found" }, 404);

  const thumbnails = await service.getThumbnailsByPageId(pageId);
  return c.json(thumbnails);
});

// * GET /api/games/thumbnail/:thumbnailId/introduction -> get introduction from thumbnail id
gamesRoutes.get("/thumbnail/:thumbnailId/introduction", async (c) => {
  const service = new GameService(c.get("db"));
  const thumbnailId = Number(c.req.param("thumbnailId"));
  const introduction = await service.getIntroductionByThumbnailId(thumbnailId);
  return c.json(introduction);
});

// * GET /api/games/introduction/:introductionId/detail -> get detail from introduction id
gamesRoutes.get("/introduction/:introductionId/detail", async (c) => {
  const service = new GameService(c.get("db"));
  const introductionId = Number(c.req.param("introductionId"));
  const detail = await service.getDetailByIntroductionId(introductionId);
  return c.json(detail);
});
