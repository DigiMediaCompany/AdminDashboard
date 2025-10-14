
CREATE TABLE maquininha_articles (
    title TEXT PRIMARY KEY,
    link TEXT UNIQUE NOT NULL,
    thumbnail TEXT,
    category TEXT,
    date TEXT,
    duration TEXT,
    content TEXT
);
