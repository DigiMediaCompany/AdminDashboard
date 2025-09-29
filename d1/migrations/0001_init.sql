-- Migration number: 0001    2025-09-01T04:19:10.258Z

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE series (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER DEFAULT NULL,
    big_context_file TEXT DEFAULT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type INTEGER NOT NULL,
    position INTEGER NOT NULL
);

CREATE TABLE progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL CHECK (status IN ('Going', 'Success', 'Failed', 'Standby')) DEFAULT 'Standby',
    status_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    FOREIGN KEY (status_id) REFERENCES statuses(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE (status_id, job_id)
);

CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    detail JSON NOT NULL DEFAULT '{}',
    series_id INTEGER DEFAULT NULL,
    episode INTEGER DEFAULT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    type INTEGER NOT NULL, -- 1: YT -> Article, 2: YT -> Summary, 3: Summary -> Article
    FOREIGN KEY (series_id) REFERENCES series(id)
);

CREATE TABLE signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status INTEGER NOT NULL DEFAULT 0
);

-- Seeding
-- TODO: use matching vars with logic, also lookup on how D1 handle seeding officially
INSERT INTO statuses (name, type, position) VALUES
('Extracting Youtube', 1, 1),
('Context review required', 1, 2),
('Generating article', 1, 3),
('Article review required', 1, 4),

('Extracting Youtube', 2, 1),
('Reviewing summary', 2, 2 ),

('Generating article', 3, 1),
('Article review required', 3, 2);

INSERT INTO signals (status) VALUES
(1);
