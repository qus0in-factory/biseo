import type{D1Database}from'@cloudflare/workers-types'
import type{TurnScope}from'../domain/timeline-record.js'
import{asRecord,TURN_COLS}from'./d1-timeline-cols.js'
export type ListOptions={limit:number;paneId?:string|null;before?:number|null}
export async function listTurns(db:D1Database,s:TurnScope,o:ListOptions){
 const w=['workspace_id=?','owner_subject=?'],b:(string|number)[]=[s.workspaceId,s.ownerSubject]
 if(o.paneId){w.push('pane_id=?');b.push(o.paneId)}
 if(o.before!=null){w.push('seq<?');b.push(o.before)}
 const x=await db.prepare(`SELECT ${TURN_COLS} FROM timeline_turns WHERE ${w.join(' AND ')} ORDER BY seq DESC LIMIT ?`).bind(...b,o.limit+1).all<Record<string,unknown>>()
 const all=(x.results??[]).map(asRecord)
 return{rows:all.slice(0,o.limit),hasMore:all.length>o.limit}
}
