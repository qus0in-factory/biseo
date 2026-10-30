-- Migration 0004: add flexible metrics columns to usage_snapshots while keeping existing window / used_percent compatible
ALTER TABLE usage_snapshots ADD COLUMN metric_id TEXT;
ALTER TABLE usage_snapshots ADD COLUMN label TEXT;
ALTER TABLE usage_snapshots ADD COLUMN unit TEXT;
ALTER TABLE usage_snapshots ADD COLUMN used REAL;
ALTER TABLE usage_snapshots ADD COLUMN limit_value REAL;
ALTER TABLE usage_snapshots ADD COLUMN remaining REAL;
