import type{D1Database}from'@cloudflare/workers-types'
import{asRecord,TURN_COLS}from'./d1-timeline-cols.js'
export async function pendingTurns(db:D1Database,workspaceId:string,limit:number){
 const now=new Date().toISOString()
 const x=await db.prepare(`SELECT ${TURN_COLS} FROM timeline_turns WHERE workspace_id=? AND status IN ('queued','working','timeout') AND NOT (status='timeout' AND IFNULL(error_code,'')='late_capture_expired') AND (next_check_at IS NULL OR next_check_at<=?) ORDER BY seq ASC LIMIT ?`).bind(workspaceId,now,limit).all<Record<string,unknown>>()
 return (x.results??[]).map(asRecord)
}
