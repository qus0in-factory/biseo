-- biseo D1 latest provider usage snapshots, one row per provider/window.
-- used_percent is the actual reported value; NULL means unknown (never estimated).
CREATE TABLE IF NOT EXISTS usage_snapshots (
  provider TEXT NOT NULL,
  window TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('available','limited','unknown')),
  used_percent REAL,
  resets_at TEXT,
  checked_at TEXT,
  limit_reached INTEGER NOT NULL DEFAULT 0,
  source TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (provider, window)
);
