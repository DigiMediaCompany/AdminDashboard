export class BlogImageDTO {
  constructor(public id: number, public image: string) {}
}

export class BlogCategoryDTO {
  constructor(public id: number, public category: string) {}
}

export class BlogTagDTO {
  constructor(public id: number, public tag: string) {}
}

export class BlogDetailDTO {
  public images: any[] = [];
  public categories: any[] = [];

  constructor(
    public id: number,
    public slug: string,
    public title: string,
    public content: string
  ) {}
}

export class BlogThumbnailDTO {
  public tags: string = "";
  public detailId: number = -1;
  public pageId: number = -1;
  constructor(
    public id: number,
    public title: string,
    public excerpt: string,
    public thumbnail: string,
    public createdAt: string
  ) {}
}
