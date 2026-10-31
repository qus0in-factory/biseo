-- Trusted-IP PIN auth. Stores only hashes and trusted IPs; no plaintext PIN.
CREATE TABLE IF NOT EXISTS trusted_ips (
  ip TEXT PRIMARY KEY,
  note TEXT,
  created_at TEXT NOT NULL,
  created_by TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS auth_pin (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  pin_hash TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS pin_attempts (
  scope TEXT PRIMARY KEY,
  failures INTEGER NOT NULL DEFAULT 0,
  window_started_at INTEGER NOT NULL,
  locked_until INTEGER NOT NULL DEFAULT 0
);
