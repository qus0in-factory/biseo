import type{D1Database}from'@cloudflare/workers-types'
import{asRecord}from'../infra/d1-turn-record.js'
export async function cancelReservation(db:D1Database,id:string,owner:string){
 const at=new Date().toISOString()
 const row=await db.prepare(`UPDATE timeline_turns SET status='cancelled',
 completed_at=?,updated_at=?,lease_token=NULL,lease_until=NULL
 WHERE request_id=? AND owner_subject=? AND status='queued' RETURNING *`)
 .bind(at,at,id,owner).first<Record<string,unknown>>()
 return row?asRecord(row):null
}
