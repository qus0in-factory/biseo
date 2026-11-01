import type{D1Database}from'@cloudflare/workers-types'
import type{TurnRecord}from'../domain/timeline-record.js'
import{turnValues}from'./d1-turn-values.js'
const SQL=`INSERT INTO timeline_turns
 (request_id,workspace_id,owner_subject,pane_id,target_name,agent_kind,prompt_text,status,response_text,error_code,created_at,updated_at,completed_at,terminal_id)
 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(request_id) DO NOTHING`
export type InsertResult='inserted'|'exists'|'busy'
export async function insertTurn(db:D1Database,r:TurnRecord):Promise<InsertResult>{
 try{
  const x=await db.prepare(SQL).bind(...turnValues(r)).run()
  return x.meta.changes?'inserted':'exists'
 }catch{
  const row=await db.prepare('SELECT request_id FROM timeline_turns WHERE request_id=?').bind(r.requestId).first()
  return row?'exists':'busy'
 }
}
