CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
);

PRAGMA foreign_keys = ON;

-- Users
CREATE TABLE IF NOT EXISTS user (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT,
  username   TEXT NOT NULL UNIQUE COLLATE NOCASE,
  is_banned  INTEGER NOT NULL DEFAULT 0 CHECK (is_banned IN (0,1)),
  is_admin   INTEGER NOT NULL DEFAULT 0 CHECK (is_admin  IN (0,1))
);

-- Movies
CREATE TABLE IF NOT EXISTS movie (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  tconst              TEXT UNIQUE,
  movie_name          TEXT NOT NULL,
  original_movie_name TEXT,
  year                INTEGER,
  runtime_minutes     INTEGER CHECK (runtime_minutes IS NULL OR runtime_minutes > 0),
  is_active           INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1))
);

-- Themes
CREATE TABLE IF NOT EXISTS theme (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL,
  user_id      INTEGER,
  timestamp    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  vote_count   INTEGER,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Movies in Themes
CREATE TABLE IF NOT EXISTS theme_movie (
  theme_id  INTEGER NOT NULL,
  movie_id  INTEGER NOT NULL,
  PRIMARY KEY (theme_id, movie_id),
  FOREIGN KEY (theme_id) REFERENCES theme(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Drinking rules
CREATE TABLE IF NOT EXISTS drinking_rule (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  theme_id  INTEGER NOT NULL,
  rule_text TEXT NOT NULL,
  FOREIGN KEY (theme_id) REFERENCES theme(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_movie_year            ON movie(year);
CREATE INDEX IF NOT EXISTS idx_movie_name_nocase     ON movie(movie_name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_theme_name_nocase     ON theme(name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_theme_user_id         ON theme(user_id);
CREATE INDEX IF NOT EXISTS idx_rule_theme_id         ON drinking_rule(theme_id);
CREATE INDEX IF NOT EXISTS idx_theme_movie_movie_id  ON theme_movie(movie_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_movie_tconst   ON movie(tconst);


