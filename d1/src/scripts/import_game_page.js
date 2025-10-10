const fs = require("fs");
const path = require("path");

// ====== CONFIG ======
const rawJsonPath = "../../data/game_page.json";
const MIGRATION_DIR = path.join(__dirname, "../../migrations");
const BATCH_SIZE = 50;

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

// ====== READ JSON ======
const raw = fs.readFileSync(rawJsonPath, "utf-8");
const json = JSON.parse(raw);

// ====== NORMALIZE DATA ======
const pages = json.pages.map((page) => ({
  pageIndex: page.index,
  pageUrl: page.page_url,
  thumbs: page.data.thumbs.map((thumb) => ({
    title: thumb.title,
    thumb_img: thumb.img,
    excerpt: thumb.excerpt,
    introduction: {
      url: thumb.introduction.url,
      postContent: thumb.introduction.post_content,
      detail: {
        url: thumb.introduction.detail.url,
        gameplayDescription: thumb.introduction.detail.gameplay_description,
        circleProgress: thumb.introduction.detail.circle_progress,
        graphicAndSound:
          thumb.introduction.detail.rating?.graphic_and_sound || 0,
        controls: thumb.introduction.detail.rating?.controls || 0,
        gameplay: thumb.introduction.detail.rating?.gameplay || 0,
        lastingAppeal: thumb.introduction.detail.rating?.lasting_appeal || 0,
        screenshots: thumb.introduction.detail.screen_shot || [],
        pros: thumb.introduction.detail.pros || [],
        cons: thumb.introduction.detail.cons || [],
      },
    },
  })),
}));

// ====== GENERATE MIGRATION FILES ======
function writeMigration(filename, sql) {
  fs.writeFileSync(path.join(MIGRATION_DIR, filename), sql);
  console.log(`✅ Migration file generated: ${filename}`);
}

// --- Pages ---
let sqlPages = "BEGIN TRANSACTION;\n";
for (const page of pages) {
  sqlPages += `INSERT INTO games_page (page_index, page_url) VALUES (${
    page.pageIndex
  }, '${escape(page.pageUrl)}');\n`;
}
sqlPages += "COMMIT;\n";
writeMigration("0003_insert_pages.sql", sqlPages);

// --- Thumbnails ---
let sqlThumbs = "BEGIN TRANSACTION;\n";
for (const page of pages) {
  const thumbRows = page.thumbs.map((thumb) => [
    `(SELECT id FROM games_page WHERE page_index=${page.pageIndex} LIMIT 1)`,
    `'${escape(thumb.title)}'`,
    `'${escape(thumb.thumb_img)}'`,
    `'${escape(thumb.excerpt || "")}'`,
  ]);
  sqlThumbs +=
    batchInsert(
      "game_thumbnail",
      ["page_id", "title", "img", "excerpt"],
      thumbRows
    ) + "\n";
}
sqlThumbs += "COMMIT;\n";
writeMigration("0004_insert_thumbnails.sql", sqlThumbs);

// --- Introductions ---
let sqlIntro = "BEGIN TRANSACTION;\n";
for (const page of pages) {
  const introRows = page.thumbs.map((thumb) => [
    `(SELECT id FROM game_thumbnail WHERE title='${escape(
      thumb.title
    )}' LIMIT 1)`,
    `'${escape(thumb.introduction.url)}'`,
    `'${escape(thumb.introduction.postContent)}'`,
  ]);
  sqlIntro +=
    batchInsert(
      "game_introduction",
      ["thumbnail_id", "url", "post_content"],
      introRows
    ) + "\n";
}
sqlIntro += "COMMIT;\n";
writeMigration("0005_insert_introductions.sql", sqlIntro);

// --- Details ---
let sqlDetail = "BEGIN TRANSACTION;\n";
for (const page of pages) {
  const detailRows = page.thumbs.map((thumb) => {
    const d = thumb.introduction.detail;
    return [
      `(SELECT id FROM game_introduction WHERE thumbnail_id=(SELECT id FROM game_thumbnail WHERE title='${escape(
        thumb.title
      )}' LIMIT 1) LIMIT 1)`,
      `'${escape(d.url)}'`,
      `'${escape(d.gameplayDescription)}'`,
      d.circleProgress,
      d.graphicAndSound,
      d.controls,
      d.gameplay,
      d.lastingAppeal,
    ];
  });
  sqlDetail +=
    batchInsert(
      "game_detail",
      [
        "introduction_id",
        "url",
        "gameplay_description",
        "circle_progress",
        "graphic_and_sound",
        "controls",
        "gameplay",
        "lasting_appeal",
      ],
      detailRows
    ) + "\n";
}
sqlDetail += "COMMIT;\n";
writeMigration("0006_insert_details.sql", sqlDetail);

// --- Screenshots, Pros, Cons ---
let sqlScreenshots = "BEGIN TRANSACTION;\n";
let sqlPros = "BEGIN TRANSACTION;\n";
let sqlCons = "BEGIN TRANSACTION;\n";

for (const page of pages) {
  for (const thumb of page.thumbs) {
    const d = thumb.introduction.detail;

    const screenshotRows = (d.screenshots || []).map((url) => [
      `(SELECT id FROM game_detail WHERE introduction_id=(SELECT id FROM game_introduction WHERE thumbnail_id=(SELECT id FROM game_thumbnail WHERE title='${escape(
        thumb.title
      )}' LIMIT 1) LIMIT 1) LIMIT 1)`,
      `'${escape(url)}'`,
    ]);
    if (screenshotRows.length)
      sqlScreenshots +=
        batchInsert(
          "game_detail_screenshots",
          ["game_detail_id", "image_url"],
          screenshotRows
        ) + "\n";

    const proRows = (d.pros || []).map((text) => [
      `(SELECT id FROM game_detail WHERE introduction_id=(SELECT id FROM game_introduction WHERE thumbnail_id=(SELECT id FROM game_thumbnail WHERE title='${escape(
        thumb.title
      )}' LIMIT 1) LIMIT 1) LIMIT 1)`,
      `'${escape(text)}'`,
    ]);
    if (proRows.length)
      sqlPros +=
        batchInsert("game_detail_pros", ["game_detail_id", "text"], proRows) +
        "\n";

    const conRows = (d.cons || []).map((text) => [
      `(SELECT id FROM game_detail WHERE introduction_id=(SELECT id FROM game_introduction WHERE thumbnail_id=(SELECT id FROM game_thumbnail WHERE title='${escape(
        thumb.title
      )}' LIMIT 1) LIMIT 1) LIMIT 1)`,
      `'${escape(text)}'`,
    ]);
    if (conRows.length)
      sqlCons +=
        batchInsert("game_detail_cons", ["game_detail_id", "text"], conRows) +
        "\n";
  }
}

sqlScreenshots += "COMMIT;\n";
sqlPros += "COMMIT;\n";
sqlCons += "COMMIT;\n";

writeMigration("0007_insert_screenshots.sql", sqlScreenshots);
writeMigration("0008_insert_pros.sql", sqlPros);
writeMigration("0009_insert_cons.sql", sqlCons);

console.log("✅ All migration files generated successfully.");
