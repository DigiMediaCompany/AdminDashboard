-- Migration number: 0004 	 2025-11-03T09:40:16.235Z
PRAGMA foreign_keys = ON;

ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT 1;
ALTER TABLE roles ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT 1;

ALTER TABLE categories ADD COLUMN type TEXT NOT NULL DEFAULT 'UNASSIGNED';

-- Delete + recreate permissions (since SQLite can't alter foreign key)
CREATE TABLE permissions_temp (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    category_id INTEGER DEFAULT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
INSERT INTO permissions_temp (id, name, description)
SELECT
    id,
    name,
    description
FROM permissions;
DROP TABLE permissions;
ALTER TABLE permissions_temp RENAME TO permissions;