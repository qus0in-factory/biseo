import type{D1Database}from'@cloudflare/workers-types'
import{asRecord}from'./d1-turn-record.js'
export async function scanQueue(db:D1Database){
 const work=await db.prepare("SELECT * FROM timeline_turns WHERE status='working' ORDER BY seq LIMIT 100").all<Record<string,unknown>>()
 const panels=await db.prepare(`SELECT workspace_id AS ws,pane_id AS pane FROM timeline_turns
 WHERE status='queued' GROUP BY workspace_id,pane_id ORDER BY MIN(seq) LIMIT 100`).all<{ws:string;pane:string}>()
 return{working:work.results.map(asRecord),panels:panels.results}
}
