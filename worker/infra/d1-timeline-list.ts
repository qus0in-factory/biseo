import type{D1Database}from'@cloudflare/workers-types'
import type{TurnScope}from'../domain/timeline-record.js'
import{asRecord,TURN_COLS}from'./d1-timeline-cols.js'
export async function listTurns(db:D1Database,s:TurnScope,limit:number){
 const x=await db.prepare(`SELECT ${TURN_COLS} FROM timeline_turns WHERE workspace_id=? AND owner_subject=? ORDER BY seq DESC LIMIT ?`).bind(s.workspaceId,s.ownerSubject,limit).all<Record<string,unknown>>()
 return (x.results??[]).map(asRecord)
}
