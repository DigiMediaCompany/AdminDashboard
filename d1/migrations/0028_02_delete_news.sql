BEGIN TRANSACTION;

-- 🧹 Drop indexes trước (nếu có)
DROP INDEX IF EXISTS idx_blog_thumbnail_tags_thumbnail_id;
DROP INDEX IF EXISTS idx_blog_thumbnails_page_id;
DROP INDEX IF EXISTS idx_blog_thumbnails_detail_id;
DROP INDEX IF EXISTS idx_blog_thumbnails_created_at;
DROP INDEX IF EXISTS idx_blog_detail_categories_detail_id;
DROP INDEX IF EXISTS idx_blog_detail_categories_category;
DROP INDEX IF EXISTS idx_blog_detail_images_detail_id;
DROP INDEX IF EXISTS idx_blog_details_slug;
DROP INDEX IF EXISTS idx_blog_details_title;

-- 🔥 Drop tables theo thứ tự phụ thuộc
DROP TABLE IF EXISTS blog_thumbnail_tag;
DROP TABLE IF EXISTS blog_thumbnails;
DROP TABLE IF EXISTS blog_detail_categories;
DROP TABLE IF EXISTS blog_detail_images;
DROP TABLE IF EXISTS blog_details;
DROP TABLE IF EXISTS blog_pages;

COMMIT;
