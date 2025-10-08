import { DrizzleD1Database } from "drizzle-orm/d1";
import {
  h5Game,
  blogPage,
  blogDetail,
  blogThumbnail,
  blogDetailCategories,
  blogDetailImages,
  blogDetailTags,
} from "../db/h5_games";
import { CrudRepository } from "../repositories/CRUDRepository";
export class H5Service {
  private h5GamesRepo: CrudRepository<typeof h5Game, "id">;
  private blogPageRepo: CrudRepository<typeof blogPage, "id">;
  private blogDetailRepo: CrudRepository<typeof blogDetail, "id">;
  private blogThumbnailRepo: CrudRepository<typeof blogThumbnail, "id">;
  private blogDetailCategoryRepo: CrudRepository<
    typeof blogDetailCategories,
    "id"
  >;
  private blogDetailImagesRepo: CrudRepository<typeof blogDetailImages, "id">;
  private blogDetailTagsRepo: CrudRepository<typeof blogDetailTags, "id">;
  constructor(private readonly db: DrizzleD1Database) {
    this.h5GamesRepo = new CrudRepository(db, h5Game, "id");
    this.blogPageRepo = new CrudRepository(db, blogPage, "id");
    this.blogDetailRepo = new CrudRepository(db, blogDetail, "id");
    this.blogThumbnailRepo = new CrudRepository(db, blogThumbnail, "id");
    this.blogDetailCategoryRepo = new CrudRepository(
      db,
      blogDetailCategories,
      "id"
    );
    this.blogDetailImagesRepo = new CrudRepository(db, blogDetailImages, "id");
    this.blogDetailTagsRepo = new CrudRepository(db, blogDetailTags, "id");
  }

  // * GET ALL
  async getH5Games() {
    return await this.h5GamesRepo.findAll();
  }

  async getPages() {
    return await this.blogPageRepo.findAll();
  }

  async getDetails() {
    return await this.blogDetailRepo.findAll();
  }

  async getThumbnails() {
    return await this.blogThumbnailRepo.findAll();
  }

  async getDetailTags(detailId: number) {
    return await this.blogDetailTagsRepo.findByField("blogDetailId", detailId);
  }

  async getDetailImages(detailId: number) {
    return await this.blogDetailImagesRepo.findByField(
      "blogDetailId",
      detailId
    );
  }

  async getDetailCategory(detailId: number) {
    return await this.blogDetailCategoryRepo.findByField(
      "blogDetailId",
      detailId
    );
  }

  // * GET by id
  async getDetailById(id: number) {
    return await this.blogDetailRepo.findById(id);
  }

  async getThumbnailById(id: number) {
    return await this.blogThumbnailRepo.findById(id);
  }

  async getPageById(id: number) {
    return await this.blogPageRepo.findById(id);
  }

  async getH5GameById(id: number) {
    return await this.h5GamesRepo.findById(id);
  }

  // GET throw relations id
  async getThumbnailByPageId(pageId: number) {
    return await this.blogThumbnailRepo.findByField("pageId", pageId);
  }

  async getThumbnailByDetailId(detailId: number) {
    return await this.blogThumbnailRepo.findByField("blogDetailId", detailId);
  }
}
