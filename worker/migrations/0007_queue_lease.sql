-- Legacy targets remain unknown; never infer a generation from a reused pane ID.
ALTER TABLE timeline_turns ADD COLUMN terminal_id TEXT;
ALTER TABLE timeline_turns ADD COLUMN lease_token TEXT;
ALTER TABLE timeline_turns ADD COLUMN lease_until INTEGER;
CREATE INDEX idx_timeline_panel_fifo
 ON timeline_turns(workspace_id,pane_id,seq)
 WHERE status IN ('queued','working','timeout');
