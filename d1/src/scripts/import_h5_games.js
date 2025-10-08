const fs = require("fs");
const path = require("path");

// ====== CONFIG ======
const rawJsonPath = "../../data/h5_games.json";
const MIGRATION_DIR = path.join(__dirname, "../../migrations");
const BATCH_SIZE = 10; // Số row mỗi batch insert
const BLOG_DETAIL_PARTS = 10; // Chia blog_detail làm 10 file
const PREFIX = "_8"; // Tiền tố thêm vào file migration

// ====== UTILS ======
function escape(str) {
  if (!str) return "";
  return str.replace(/'/g, "''");
}

function batchInsert(table, columns, rows, batchSize = BATCH_SIZE) {
  const statements = [];
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const values = batch.map((row) => `(${row.join(", ")})`).join(",\n");
    statements.push(
      `INSERT INTO ${table} (${columns.join(", ")}) VALUES\n${values};`
    );
  }
  return statements.join("\n");
}

function writeMigration(filename, sql) {
  if (!fs.existsSync(MIGRATION_DIR))
    fs.mkdirSync(MIGRATION_DIR, { recursive: true });
  fs.writeFileSync(path.join(MIGRATION_DIR, filename), sql);
  console.log(`✅ Migration file generated: ${filename}`);
}

// ====== READ JSON ======
const raw = fs.readFileSync(rawJsonPath, "utf-8");
const json = JSON.parse(raw);

// ====== NORMALIZE DATA ======
const h5_games = json.pages.map((page) => ({
  pageIndex: page.page,
  pageUrl: page.page_url,
  thumbs: page.data.thumbnails.map((thumb) => ({
    title: thumb.title,
    thumbnailUrl: thumb.thumbnail_img,
    detail: {
      title: thumb.details.title,
      description: thumb.details.description,
      instructions: thumb.details.instructions,
      language: thumb.details.language,
      categories: thumb.details.categories || [],
      tags: thumb.details.tags || [],
      h5Game: {
        siteUrl: thumb.details.h5_game.url,
        playUrl: thumb.details.h5_game.game_url,
      },
      images: thumb.details.images || [],
    },
  })),
}));

// ====== H5Game Migration ======
let sqlH5Game = "BEGIN TRANSACTION;\n";
const h5GameRows = [];
const h5GameMap = new Map();

h5_games.forEach((page) => {
  page.thumbs.forEach((thumb) => {
    const game = thumb.detail.h5Game;
    if (!h5GameMap.has(game.siteUrl)) {
      h5GameRows.push([
        `'${escape(game.siteUrl)}'`,
        `'${escape(game.playUrl)}'`,
      ]);
      h5GameMap.set(game.siteUrl, h5GameRows.length);
    }
  });
});

sqlH5Game += batchInsert("h5_game", ["site_url", "play_url"], h5GameRows);
sqlH5Game += "COMMIT;\n";
writeMigration(`0011${PREFIX}_insert_h5_games.sql`, sqlH5Game);

// ====== BlogPage Migration ======
let sqlPages = "BEGIN TRANSACTION;\n";
const pageRows = [];

h5_games.forEach((page, index) => {
  pageRows.push([page.pageIndex, `'${escape(page.pageUrl)}'`]);
  page._generatedId = index + 1;
});

sqlPages += batchInsert("h5_blog_page", ["page_index", "page_url"], pageRows);
sqlPages += "COMMIT;\n";
writeMigration(`0012${PREFIX}_insert_pages.sql`, sqlPages);

// ====== BlogDetail Migration (chia nhiều file) ======
let blogDetailId = 1;
const totalDetails = [];

h5_games.forEach((page) => {
  page.thumbs.forEach((thumb) => {
    const detail = thumb.detail;
    totalDetails.push([
      `'${escape(detail.title)}'`,
      h5GameMap.get(detail.h5Game.siteUrl),
      detail.description ? `'${escape(detail.description)}'` : "NULL",
      detail.instructions ? `'${escape(detail.instructions)}'` : "NULL",
      detail.language ? `'${escape(detail.language)}'` : "NULL",
    ]);

    detail._generatedId = blogDetailId;
    blogDetailId++;
  });
});

const chunkSize = Math.ceil(totalDetails.length / BLOG_DETAIL_PARTS);
let fileCounter = 13;

for (let i = 0; i < totalDetails.length; i += chunkSize) {
  const chunk = totalDetails.slice(i, i + chunkSize);
  let sql = "BEGIN TRANSACTION;\n";
  sql += batchInsert(
    "h5_blog_detail",
    ["title", "h5_game_id", "description", "instructions", "language"],
    chunk
  );
  sql += "\nCOMMIT;\n";

  const fileIndex = Math.floor(i / chunkSize) + 1;
  const fileName = `${String(fileCounter).padStart(
    4,
    "0"
  )}${PREFIX}_insert_blog_details_part_${fileIndex}.sql`;
  writeMigration(fileName, sql);
  fileCounter++;
}

// ====== BlogThumbnail Migration ======
let sqlThumbnails = "BEGIN TRANSACTION;\n";
const thumbRows = [];

h5_games.forEach((page) => {
  const pageId = page._generatedId;
  page.thumbs.forEach((thumb) => {
    const detailId = thumb.detail._generatedId;
    thumbRows.push([
      pageId,
      `'${escape(thumb.title)}'`,
      `'${escape(thumb.thumbnailUrl)}'`,
      detailId,
    ]);
  });
});

sqlThumbnails += batchInsert(
  "h5_blog_thumbnail",
  ["page_id", "title", "thumbnail_url", "blog_detail_id"],
  thumbRows
);
sqlThumbnails += "COMMIT;\n";
writeMigration(`0023${PREFIX}_insert_thumbnails.sql`, sqlThumbnails);

// ====== Categories, Tags, Images ======
let sqlCategories = "BEGIN TRANSACTION;\n";
let sqlTags = "BEGIN TRANSACTION;\n";
let sqlImages = "BEGIN TRANSACTION;\n";

const categoryRows = [];
const tagRows = [];
const imageRows = [];

h5_games.forEach((page) => {
  page.thumbs.forEach((thumb) => {
    const detailId = thumb.detail._generatedId;

    thumb.detail.categories.forEach((cat) =>
      categoryRows.push([detailId, `'${escape(cat)}'`])
    );
    thumb.detail.tags.forEach((tag) =>
      tagRows.push([detailId, `'${escape(tag)}'`])
    );
    thumb.detail.images.forEach((img) =>
      imageRows.push([detailId, `'${escape(img)}'`])
    );
  });
});

sqlCategories += batchInsert(
  "h5_blog_detail_categories",
  ["blog_detail_id", "category"],
  categoryRows
);
sqlCategories += "COMMIT;\n";
writeMigration(`0024${PREFIX}_insert_categories.sql`, sqlCategories);

sqlTags += batchInsert(
  "h5_blog_detail_tags",
  ["blog_detail_id", "tag"],
  tagRows
);
sqlTags += "COMMIT;\n";
writeMigration(`0025${PREFIX}_insert_tags.sql`, sqlTags);

sqlImages += batchInsert(
  "h5_blog_detail_images",
  ["blog_detail_id", "image_url"],
  imageRows
);
sqlImages += "COMMIT;\n";
writeMigration(`0026${PREFIX}_insert_images.sql`, sqlImages);

console.log("✅ All migrations generated successfully với tiền tố _8.");
