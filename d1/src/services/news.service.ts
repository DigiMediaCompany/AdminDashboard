import type { DrizzleD1Database } from "drizzle-orm/d1";
import {
  blogPages,
  blogDetails,
  blogDetailCategories,
  blogThumbnails,
  blogThumbnailTags,
  blogDetailImages,
  detailRelations,
} from "../db/news";
import { BlogDetailDTO, BlogThumbnailDTO } from "../dto/NewsDTO";
import { CrudRepository } from "../repositories/CRUDRepository";
import { eq } from "drizzle-orm";

export class NewsService {
  private pagesRepo: CrudRepository<typeof blogPages, "id">;
  private thumbnailsRepo: CrudRepository<typeof blogThumbnails, "id">;
  private detailsRepo: CrudRepository<typeof blogDetails, "id">;
  private categoriesRepo: CrudRepository<typeof blogDetailCategories, "id">;
  private tagsRepo: CrudRepository<typeof blogThumbnailTags, "id">;
  private imagesRepo: CrudRepository<typeof blogDetailImages, "id">;
  constructor(private readonly db: DrizzleD1Database) {
    this.pagesRepo = new CrudRepository(db, blogPages, "id");
    this.detailsRepo = new CrudRepository(db, blogDetails, "id");
    this.thumbnailsRepo = new CrudRepository(db, blogThumbnails, "id");
    this.categoriesRepo = new CrudRepository(db, blogDetailCategories, "id");
    this.tagsRepo = new CrudRepository(db, blogThumbnailTags, "id");
    this.imagesRepo = new CrudRepository(db, blogDetailImages, "id");
  }
  async getPages() {
    return await this.pagesRepo.findAll();
  }
  async getThumbnails() {
    return await this.thumbnailsRepo.findAll();
  }
  async getDetails() {
    return await this.detailsRepo.findAll();
  }
  async getCategories() {
    return await this.categoriesRepo.findAll();
  }
  async getTags() {
    return await this.tagsRepo.findAll();
  }
  async getImages() {
    return await this.imagesRepo.findAll();
  }

  async getCategoriesByDetailId(detailId: number) {
    return await this.categoriesRepo.findByField("blogDetailId", detailId);
  }
  async getImagesByDetailId(detailId: number) {
    return await this.imagesRepo.findByField("blogDetailId", detailId);
  }
  async getTagsByThumbnailId(thumbnailId: number) {
    return await this.tagsRepo.findByField("blogThumbnailId", thumbnailId);
  }
  async getDetailByThumbnailId(thumbnailId: number) {
    const thumb = this.thumbnailsRepo.findById(thumbnailId);
    const detail = this.detailsRepo.findByField(
      "id",
      (await thumb).blogDetailId
    );
    return detail;
  }
  async getThumbnailsByPageId(pageId: number) {
    const page = await this.detailsRepo.findById(pageId);
    const thumb = await this.thumbnailsRepo.findByField("pageId", page.id);
    return thumb;
  }

  async getPageById(id: number) {
    return await this.pagesRepo.findById(id);
  }
  async getThumbnailById(id: number) {
    return await this.thumbnailsRepo.findById(id);
  }
  async getDetailById(id: number) {
    return await this.categoriesRepo.findById(id);
  }
  async getTagById(id: number) {
    return await this.tagsRepo.findById(id);
  }
  async getCategoryById(id: number) {
    return await this.categoriesRepo.findById(id);
  }
  async getImageById(id: number) {
    return await this.imagesRepo.findById(id);
  }

  async getDetailDataById(id: number): Promise<BlogDetailDTO> {
    const detail = await this.detailsRepo.findById(id);
    const data = new BlogDetailDTO(
      detail.id,
      detail.slug,
      detail.title,
      detail.content
    );
    const images = await this.imagesRepo.findByField("blogDetailId", id);
    const categories = await this.categoriesRepo.findByField(
      "blogDetailId",
      id
    );
    data.images = images.map((i) => i.image);
    data.categories = categories.map((c) => c.category);
    return data;
  }

  async getThumbnailDataById(id: number): Promise<BlogThumbnailDTO> {
    const thumb = await this.thumbnailsRepo.findById(id);
    const tags = await this.tagsRepo.findByField("blogThumbnailId", id);
    const data = new BlogThumbnailDTO(
      thumb.id,
      thumb.title,
      thumb.excerpt,
      thumb.thumbnail,
      thumb.createdAt
    );
    data.pageId = thumb.pageId;
    data.tags = tags[0].tag;
    data.detailId = thumb.blogDetailId;
    return data;
  }
}
