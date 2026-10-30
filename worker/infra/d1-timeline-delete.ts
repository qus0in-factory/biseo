import type{D1Database}from'@cloudflare/workers-types'
export async function deleteTurn(db:D1Database,id:string){
 await db.prepare(`DELETE FROM timeline_turns WHERE request_id=? AND status='queued'`).bind(id).run()
}
