export const CLAIM_SQL=`UPDATE timeline_turns
 SET lease_token=?,lease_until=?
 WHERE seq=(SELECT MIN(seq) FROM timeline_turns
 WHERE workspace_id=? AND pane_id=?
 AND status IN ('queued','working','timeout'))
 AND status='queued' AND terminal_id IS NOT NULL
 AND (lease_until IS NULL OR lease_until<=?) AND queue_attempts<?
 RETURNING *`
