
CREATE TABLE maquininha_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    link TEXT UNIQUE NOT NULL,
    thumbnail TEXT,
    category TEXT,
    date TEXT,
    duration TEXT,
    content TEXT
);
