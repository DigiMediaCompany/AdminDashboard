CREATE TABLE maquininha_machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    link TEXT UNIQUE NOT NULL,
    thumbnail TEXT,
    content TEXT
);
