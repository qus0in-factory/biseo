-- bounded cron lease and backoff state.
CREATE TABLE IF NOT EXISTS sync_state (
  key TEXT PRIMARY KEY,
  holder TEXT,
  expires_at INTEGER NOT NULL DEFAULT 0,
  next_at INTEGER NOT NULL DEFAULT 0,
  failures INTEGER NOT NULL DEFAULT 0
);
