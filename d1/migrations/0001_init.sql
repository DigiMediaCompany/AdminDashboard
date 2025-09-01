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
    type TEXT NOT NULL,
    position INTEGER NOT NULL
);

CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_youtube_link TEXT UNIQUE,
    youtube_id TEXT UNIQUE,
    gpt_conversation_id TEXT DEFAULT NULL,
    series_id INTEGER DEFAULT NULL,
    episode INTEGER DEFAULT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    status_id INTEGER NOT NULL,
    context_file TEXT DEFAULT NULL,
    article_file TEXT DEFAULT NULL,
    FOREIGN KEY (series_id) REFERENCES series(id),
    FOREIGN KEY (status_id) REFERENCES statuses(id),
    UNIQUE (series_id, episode)
);

-- Seeding
INSERT INTO statuses (name, type, position) VALUES
('Pending', 'article', 1),
('Extracting Youtube', 'article', 2),
('Context review required', 'article', 3),
('Generating article', 'article', 4),
('Article review required', 'article', 5),
('Generating big context', 'article', 6),
('Big context review required', 'article', 7),
('Done', 'article', 8),
('Failed', 'article', 9);
