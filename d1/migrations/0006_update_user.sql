-- Migration number: 0006      2025-11-03T19:04:33.027Z

CREATE TABLE users_temp (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supabase_id TEXT UNIQUE NOT NULL,
    supabase_email TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
);

INSERT INTO users_temp (id, name, email, supabase_id, supabase_email, is_active)
SELECT
    id,
    name,
    email,
    supabase_id,
    COALESCE(email, ('user_' || id || '@example.com')) AS supabase_email,
    is_active
FROM users;

DROP TABLE users;

ALTER TABLE users_temp RENAME TO users;
