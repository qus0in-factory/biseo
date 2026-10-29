-- biseo D1 timeline + sync lease. Apply only after approval.
CREATE TABLE IF NOT EXISTS timeline_turns (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id TEXT NOT NULL UNIQUE,
  workspace_id TEXT NOT NULL,
  owner_subject TEXT NOT NULL,
  pane_id TEXT NOT NULL,
  target_name TEXT NOT NULL,
  agent_kind TEXT,
  prompt_text TEXT NOT NULL,
  response_text TEXT,
  status TEXT NOT NULL CHECK (
    status IN ('queued','working','completed','capture_unavailable','blocked','failed','timeout','cancelled')
  ),
  error_code TEXT,
  next_check_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_timeline_scope
  ON timeline_turns (workspace_id, owner_subject, seq DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_timeline_active_pane
  ON timeline_turns (workspace_id, owner_subject, pane_id)
  WHERE status IN ('queued','working');
