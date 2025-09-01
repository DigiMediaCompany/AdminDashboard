-- Migration number: 0001 	 2025-09-01T04:19:10.258Z

CREATE TABLE Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE Series (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    big_context_file TEXT,
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

CREATE TABLE Statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
);

CREATE TABLE Jobs (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     raw_youtube_link TEXT NOT NULL UNIQUE,
     youtube_id TEXT NOT NULL UNIQUE,
     gpt_conversation_id TEXT,
     series_id INTEGER,
     episode INTEGER,
     priority INTEGER NOT NULL DEFAULT 0,
     status_id INTEGER,
     context_file TEXT,
     article_file TEXT,
     FOREIGN KEY (series_id) REFERENCES Series(id),
     FOREIGN KEY (status_id) REFERENCES Statuses(id),
     UNIQUE (series_id, espisode)
);