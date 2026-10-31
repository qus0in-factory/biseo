import type{D1Database}from'@cloudflare/workers-types'
export function panePending(db:D1Database,pane:string){
 return db.prepare(`SELECT 1 FROM timeline_turns WHERE pane_id=?
 AND status IN ('queued','working','blocked','timeout') LIMIT 1`)
 .bind(pane).first()
}
