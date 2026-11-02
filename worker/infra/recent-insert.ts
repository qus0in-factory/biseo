import type{D1Database}from'@cloudflare/workers-types'
import type{TurnRecord}from'../domain/timeline-record.js'
import{turnValues}from'./d1-turn-values.js'
export async function insertRecent(db:D1Database,record:TurnRecord){
 const result=await db.prepare(`INSERT INTO timeline_turns
 (request_id,workspace_id,owner_subject,pane_id,target_name,agent_kind,prompt_text,status,response_text,error_code,created_at,updated_at,completed_at,terminal_id)
 SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS
 (SELECT 1 FROM timeline_turns WHERE workspace_id=? AND owner_subject=? AND pane_id=? AND prompt_text=?
 AND (response_text=? OR status IN ('queued','working','timeout')))
 ON CONFLICT(request_id) DO NOTHING`).bind(...turnValues(record),record.workspaceId,record.ownerSubject,record.paneId,record.promptText,record.responseText).run()
 return !!result.meta.changes
}
