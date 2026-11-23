CREATE TABLE IF NOT EXISTS archives (
  github_id TEXT PRIMARY KEY,
  body TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
