import { Hono } from "hono";
import { H5Service } from "../services/h5.service";
type Bindings = {
  DB: D1Database;
};
export const h5Routes = new Hono<{ Bindings: Bindings }>();
// GET /api/h5/pages --> get all page
h5Routes.get("/pages", async (c) => {
  const service = new H5Service(c.get("db"));
  const pages = await service.getPages();
  return c.json(pages);
});

// GET /api/h5/details --> get all details
h5Routes.get("/details", async (c) => {
  const service = new H5Service(c.get("db"));
  const details = await service.getDetails();
  return c.json(details);
});

// GET /api/h5/thumbnails --> get all thumbnails
h5Routes.get("/thumbnails", async (c) => {
  const service = new H5Service(c.get("db"));
  const thumbnails = await service.getThumbnails();
  return c.json(thumbnails);
});

// GET /api/h5/pages/:pageId --> get page by id
h5Routes.get("/pages/:pageId", async (c) => {
  const service = new H5Service(c.get("db"));
  const pageId = Number(c.req.param("pageId"));
  const page = await service.getPageById(pageId);
  return c.json(page);
});

// GET /api/h5/thumbnails/:thumbnailId --> get thumbnail by id
h5Routes.get("/thumbnails/:thumbnailId", async (c) => {
  const service = new H5Service(c.get("db"));
  const thumbnailId = Number(c.req.param("thumbnailId"));
  const thumb = await service.getThumbnailById(thumbnailId);
  return c.json(thumb);
});

// GET /api/h5/details/:detailId --> get detail by id
h5Routes.get("/details/:detailId", async (c) => {
  const service = new H5Service(c.get("db"));
  const detail = await service.getDetailById(Number(c.req.param("detailId")));
  return c.json(detail);
});

// GET /api/h5/h5-games/:h5GameId --> get h5-game by id
h5Routes.get("/h5-games/:h5GameId", async (c) => {
  const service = new H5Service(c.get("db"));
  const h5_game = await service.getH5GameById(Number(c.req.param("h5GameId")));
  return c.json(h5_game);
});

// GET /api/h5/pages/:pageId/thumbnails
h5Routes.get("/pages/:pageId/thumbnails", async (c) => {
  const service = new H5Service(c.get("db"));
  const thumbnail = await service.getThumbnailByPageId(
    Number(c.req.param("pageId"))
  );
  return c.json(thumbnail);
});
