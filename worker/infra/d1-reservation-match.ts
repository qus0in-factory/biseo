import type{D1Database}from'@cloudflare/workers-types'
import type{TurnRecord}from'../domain/timeline-record.js'
export async function reservationMatches(db:D1Database,r:TurnRecord){
 const row=await db.prepare(`SELECT 1 FROM timeline_turns
 WHERE request_id=? AND workspace_id=? AND owner_subject=?
 AND pane_id=? AND prompt_text=?`).bind(
  r.requestId,r.workspaceId,r.ownerSubject,r.paneId,r.promptText,
 ).first()
 return !!row
}
