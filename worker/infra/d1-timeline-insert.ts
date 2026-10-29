import type{D1Database}from'@cloudflare/workers-types'
import type{TurnRecord}from'../domain/timeline-record.js'
const SQL=`INSERT INTO timeline_turns
 (request_id,workspace_id,owner_subject,pane_id,target_name,agent_kind,prompt_text,status,response_text,error_code,created_at,updated_at,completed_at)
 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(request_id) DO NOTHING`
export type InsertResult='inserted'|'exists'|'busy'
export async function insertTurn(db:D1Database,r:TurnRecord):Promise<InsertResult>{
 try{
  const x=await db.prepare(SQL).bind(r.requestId,r.workspaceId,r.ownerSubject,r.paneId,r.targetName,r.agentKind,r.promptText,r.status,r.responseText,r.errorCode,r.createdAt,r.updatedAt,r.completedAt).run()
  return x.meta.changes?'inserted':'exists'
 }catch{
  const row=await db.prepare('SELECT request_id FROM timeline_turns WHERE request_id=?').bind(r.requestId).first()
  return row?'exists':'busy'
 }
}
