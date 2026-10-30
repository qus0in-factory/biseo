import type{D1Database}from'@cloudflare/workers-types'
import type{TurnScope}from'../domain/timeline-record.js'
import{asRecord,TURN_COLS}from'./d1-timeline-cols.js'
export async function findTurn(db:D1Database,s:TurnScope,id:string){
 const r=await db.prepare(`SELECT ${TURN_COLS} FROM timeline_turns WHERE request_id=? AND workspace_id=? AND owner_subject=?`).bind(id,s.workspaceId,s.ownerSubject).first<Record<string,unknown>>()
 return r?asRecord(r):null
}
