// scripts/generateBlogSeedSQL_fixed_order.js
const fs = require("fs");
const path = require("path");

// ====== CONFIG ======
const rawJsonPath = path.join(__dirname, "../../data/blog_news.json");
const OUTPUT_DIR = path.join(__dirname, "../../migrations");
const PREFIX = "_13"; // tiền tố file
const DETAIL_PARTS = 30; // chia detail thành 10 file
const THUMB_PARTS = 30; // chia thumbnail thành 10 file
const BATCH_SIZE = 6;

// ====== HELPERS ======
function escapeSQL(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function batchInsert(table, columns, rows, batchSize = BATCH_SIZE) {
  if (!rows.length) return "";
  const statements = [];

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const values = batch.map((r) => `(${r.join(", ")})`).join(",\n");

    // 🧩 Mỗi batch có transaction riêng để tránh crash hash index
    statements.push(
      `INSERT INTO ${table} (${columns.join(", ")}) VALUES\n${values};\n`
    );
  }

  return statements.join("\n\n");
}

function writeMigration(order, name, sql) {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const padded = String(order).padStart(4, "0");
  const filename = `${padded}${PREFIX}_${name}.sql`;
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), sql);
  console.log("✅ Created:", filename);
}

// ====== READ & NORMALIZE ======
const raw = fs.readFileSync(rawJsonPath, "utf-8");
const json = JSON.parse(raw);

const normalizedNews = (json.pages || []).map((page) => ({
  pageIndex: page.page,
  thumbnails: (page.thumbnails || []).map((thumb) => ({
    title: thumb.title?.trim() || null,
    excerpt: thumb.excerpt?.trim() || null,
    thumbnail: thumb.thumbnail || null,
    createdAt: (() => {
      const d = new Date(thumb.created_date);
      return isNaN(d) ? null : d.toISOString();
    })(),
    tag: Array.isArray(thumb.tags) ? thumb.tags : [],
    detail: {
      slug:
        thumb.details?.slug || thumb.title?.toLowerCase().replace(/\s+/g, "-"),
      title: thumb.title?.trim() || null,
      content: thumb.details?.content || null,
      images: Array.isArray(thumb.details?.images) ? thumb.details.images : [],
      categories: Array.isArray(thumb.details?.categories)
        ? thumb.details.categories
        : [],
    },
  })),
}));

// ====== PREPARE ROWS ======
let pageIdCounter = 1;
let detailIdCounter = 1;
let thumbIdCounter = 1;
let tagIdCounter = 1;
let imageIdCounter = 1;
let categoryIdCounter = 1;

const pageRows = [];
const detailRows = [];
const thumbnailRows = [];
const tagRows = [];
const imageRows = [];
const categoryRows = [];

// Build arrays; note: we assign incremental ids locally so cross-ref works deterministically
for (const page of normalizedNews) {
  const pageLocalId = pageIdCounter++;
  pageRows.push([pageLocalId, page.pageIndex]);

  for (const thumb of page.thumbnails) {
    const detailLocalId = detailIdCounter++;
    const thumbLocalId = thumbIdCounter++;

    // details: id, slug, title, content
    detailRows.push([
      detailLocalId,
      escapeSQL(thumb.detail.slug),
      escapeSQL(thumb.detail.title),
      escapeSQL(thumb.detail.content || ""),
    ]);

    // thumbnails: id, page_id, blog_detail_id, title, excerpt, thumbnail, created_at
    thumbnailRows.push([
      thumbLocalId,
      pageLocalId,
      detailLocalId,
      escapeSQL(thumb.title),
      escapeSQL(thumb.excerpt || ""),
      escapeSQL(thumb.thumbnail),
      escapeSQL(thumb.createdAt),
    ]);

    // tags (many)
    for (const t of thumb.tag || []) {
      tagRows.push([tagIdCounter++, thumbLocalId, escapeSQL(t)]);
    }

    // images
    for (const img of thumb.detail.images || []) {
      imageRows.push([imageIdCounter++, detailLocalId, escapeSQL(img)]);
    }

    // categories
    for (const cat of thumb.detail.categories || []) {
      categoryRows.push([categoryIdCounter++, detailLocalId, escapeSQL(cat)]);
    }
  }
}

// ====== EXPORT SQL FILES (REORDERED: pages -> details -> thumbnails -> tags/images/categories) ======
let fileOrder = 28;

// 1) Pages
let sqlPages = "";
sqlPages += batchInsert("blog_pages", ["id", "page_index"], pageRows);
writeMigration(fileOrder++, "insert_news_pages", sqlPages);

// 2) Details (split into DETAIL_PARTS)
const detailChunk = Math.max(1, Math.ceil(detailRows.length / DETAIL_PARTS));
for (let i = 0; i < detailRows.length; i += detailChunk) {
  const chunk = detailRows.slice(i, i + detailChunk);
  let sql = "";
  sql += batchInsert("blog_details", ["id", "slug", "title", "content"], chunk);
  const idx = Math.floor(i / detailChunk) + 1;
  writeMigration(fileOrder++, `insert_news_details_part_${idx}`, sql);
}

// 3) Thumbnails (split into THUMB_PARTS)
const thumbChunk = Math.max(1, Math.ceil(thumbnailRows.length / THUMB_PARTS));
for (let i = 0; i < thumbnailRows.length; i += thumbChunk) {
  const chunk = thumbnailRows.slice(i, i + thumbChunk);
  let sql = "";
  sql += batchInsert(
    "blog_thumbnails",
    [
      "id",
      "page_id",
      "blog_detail_id",
      "title",
      "excerpt",
      "thumbnail",
      "created_at",
    ],
    chunk
  );
  const idx = Math.floor(i / thumbChunk) + 1;
  writeMigration(fileOrder++, `insert_news_thumbnails_part_${idx}`, sql);
}

// 4) Tags
let sqlTags = "";
sqlTags += batchInsert(
  "blog_thumbnail_tag",
  ["id", "blog_thumbnail_id", "tag"],
  tagRows
);
writeMigration(fileOrder++, "insert_news_tags", sqlTags);

// 5) Images
let sqlImages = "";
sqlImages += batchInsert(
  "blog_detail_images",
  ["id", "blog_detail_id", "image"],
  imageRows
);
writeMigration(fileOrder++, "insert_news_images", sqlImages);

// 6) Categories
let sqlCategories = "";
sqlCategories += batchInsert(
  "blog_detail_categories",
  ["id", "blog_detail_id", "category"],
  categoryRows
);
writeMigration(fileOrder++, "insert_news_categories", sqlCategories);

console.log("🎯 All SQL seed files generated in", OUTPUT_DIR);
