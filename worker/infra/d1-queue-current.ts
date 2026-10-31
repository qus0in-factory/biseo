import type{D1Database}from'@cloudflare/workers-types'
export function queueLease(db:D1Database,id:string){
 return db.prepare('SELECT lease_token AS token FROM timeline_turns WHERE request_id=? AND status=\'working\' AND lease_until>?')
 .bind(id,Date.now()).first<{token:string}>()
}
