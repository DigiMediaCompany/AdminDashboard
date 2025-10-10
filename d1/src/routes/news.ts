import { Hono } from "hono";
import { NewsService } from "../services/news.service";
type Bindings = {
  DB: D1Database;
};
export const newsRoutes = new Hono<{ Bindings: Bindings }>();
// * GET /api/news/pages --> get all pages
newsRoutes.get("/pages", async (c) => {
  const service = new NewsService(c.get("db"));
  const pages = await service.getPages();
  return c.json(pages);
});

// * GET /api/news/thumbnails --> get all thumbs
newsRoutes.get("/thumbnails", async (c) => {
  const service = new NewsService(c.get("db"));
  const thumbs = await service.getThumbnails();
  return c.json(thumbs);
});

// * GET /api/news/details --> get all details
newsRoutes.get("/details", async (c) => {
  const service = new NewsService(c.get("db"));
  const details = await service.getDetails();
  return c.json(details);
});

// * GET /api/news/pages/:pageId/thumbnails --> get thumbnails by page-id
newsRoutes.get("/pages/:pageId/thumbnails", async (c) => {
  const service = new NewsService(c.get("db"));
  const thumbnails = await service.getThumbnailsByPageId(
    Number(c.req.param("pageId"))
  );
  return c.json(thumbnails);
});
// * GET /api/news/thumbnails/:thumbnailId/details --> get detail by thumbnail-id
newsRoutes.get("/thumbnails/:thumbnailId/details", async (c) => {
  const service = new NewsService(c.get("db"));
  const detail = await service.getDetailByThumbnailId(
    Number(c.req.param("thumbnailId"))
  );
  return c.json(detail);
});

// * GET /api/news/thumbnails/:thumbnailId/tags --> get tags by thumbnail-id
newsRoutes.get("/thumbnails/:thumbnailId/tags", async (c) => {
  const service = new NewsService(c.get("db"));
  const tags = await service.getTagsByThumbnailId(
    Number(c.req.param("thumbnailId"))
  );
  return c.json(tags);
});

// * GET /api/news/details/:detailId/images --> get images by detail-id
newsRoutes.get("/details/:detailId/images", async (c) => {
  const service = new NewsService(c.get("db"));
  const tags = await service.getImagesByDetailId(
    Number(c.req.param("detailId"))
  );
  return c.json(tags);
});

// * GET /api/news/:detailId --> get detail data
newsRoutes.get("/details/:detailId", async (c) => {
  const service = new NewsService(c.get("db"));
  const data = await service.getDetailDataById(Number(c.req.param("detailId")));
  return c.json(data);
});

// * GET /api/news/thumbnails/:thumbnailId --> get thumbnail data
newsRoutes.get("/thumbnails/:thumbnailId", async (c) => {
  const service = new NewsService(c.get("db"));
  const data = await service.getThumbnailDataById(
    Number(c.req.param("thumbnailId"))
  );
  return c.json(data);
});
