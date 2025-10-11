CREATE TABLE machines (
    title TEXT PRIMARY KEY,
    link TEXT UNIQUE NOT NULL,
    thumbnail TEXT,
    content TEXT
);
