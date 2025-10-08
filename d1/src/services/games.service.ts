import type { DrizzleD1Database } from "drizzle-orm/d1";
import {
  gameDetail,
  gameDetailCons,
  gameDetailPros,
  gameIntroduction,
  gamesPage,
  gameThumbnail,
} from "../db/games";
import { CrudRepository } from "../repositories/CRUDRepository";
export class GameService {
  private gamePageRepo: CrudRepository<typeof gamesPage, "id">;
  private thumbnailRepo: CrudRepository<typeof gameThumbnail, "id">;
  private introductionRepo: CrudRepository<typeof gameIntroduction, "id">;
  private detailRepo: CrudRepository<typeof gameDetail, "id">;
  private detailProsRepo: CrudRepository<typeof gameDetailPros, "id">;
  private detailConsRepo: CrudRepository<typeof gameDetailCons, "id">;
  constructor(private readonly db: DrizzleD1Database) {
    this.gamePageRepo = new CrudRepository(db, gamesPage, "id");
    this.thumbnailRepo = new CrudRepository(db, gameThumbnail, "id");
    this.introductionRepo = new CrudRepository(db, gameIntroduction, "id");
    this.detailRepo = new CrudRepository(db, gameDetail, "id");
    this.detailProsRepo = new CrudRepository(db, gameDetailPros, "id");
    this.detailConsRepo = new CrudRepository(db, gameDetailCons, "id");
  }
  //* GET all
  async getGamePages() {
    return await this.gamePageRepo.findAll();
  }

  async getThumbs() {
    return await this.thumbnailRepo.findAll();
  }

  async getIntroductions() {
    return await this.introductionRepo.findAll();
  }
  async getDetails() {
    return await this.detailRepo.findAll();
  }
  async getDetailPros(detailId: number) {
    return await this.detailProsRepo.findByField("gameDetailId", detailId);
  }
  async getDetailCons(detailId: number) {
    return await this.detailConsRepo.findByField("gameDetailId", detailId);
  }
  //* GET by id
  async getGamePageById(pageId: number) {
    return await this.gamePageRepo.findById(pageId);
  }

  async getDetailProsByDetailId(detailId: number) {
    return await this.detailRepo;
  }
  async getDetailById(detailId: number) {
    return await this.detailRepo.findById(detailId);
  }
  async getIntroductionById(introductionId: number) {
    return await this.introductionRepo.findById(introductionId);
  }
  async getThumbnailById(thumbnailId: number) {
    return await this.thumbnailRepo.findById(thumbnailId);
  }

  // * GET throw relations
  async getThumbnailsByPageId(pageId: number) {
    return await this.thumbnailRepo.findByField("pageId", pageId);
  }

  async getIntroductionByThumbnailId(thumbnailId: number) {
    return await this.introductionRepo.findByField("thumbnailId", thumbnailId);
  }

  async getDetailByIntroductionId(introductionId: number) {
    return await this.detailRepo.findByField("introductionId", introductionId);
  }
}
