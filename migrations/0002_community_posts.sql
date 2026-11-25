CREATE TABLE community_posts (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  display_name TEXT NOT NULL,
  mood TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(owner_id, source_id)
);

CREATE INDEX community_feed ON community_posts(created_at DESC, id DESC);
CREATE INDEX community_by_owner ON community_posts(owner_id, created_at DESC, id DESC);
