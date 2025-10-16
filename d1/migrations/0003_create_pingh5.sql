/** 
* blogs
*/
CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  thumbnail TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tag TEXT,
  createdDate TEXT DEFAULT CURRENT_TIMESTAMP,
  content TEXT
);

/** 
* h5_games
*/
CREATE TABLE IF NOT EXISTS h5_games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sourceId INTEGER UNIQUE,
  thumbnail TEXT NOT NULL,
  title TEXT NOT NULL,
  rating REAL NOT NULL DEFAULT 0.5,
  content TEXT,
  tags TEXT NOT NULL DEFAULT '{"language":"English","gender":["Male","Female"],"category":["Arcade"],"tags":[]}',
  gameplayLink TEXT
);

/** 
* h5_games_tags
*/
CREATE TABLE IF NOT EXISTS h5_games_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  h5GamesId INTEGER,
  FOREIGN KEY (h5GamesId) REFERENCES h5_games(id) ON DELETE CASCADE
);

/** 
* app_reviews
*/
CREATE TABLE IF NOT EXISTS app_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  description TEXT,
  rating REAL DEFAULT 4.5,
  content TEXT,
  screenshots TEXT,
  summary TEXT,
  circleScore INTEGER DEFAULT 45,
  graphicAndSound REAL DEFAULT 4.5,
  gamePlay REAL DEFAULT 4.5,
  controls REAL DEFAULT 4.5,
  lastingAppeal REAL DEFAULT 4.5,
  pros TEXT,
  cons TEXT,
  gameWebsiteLink TEXT
);