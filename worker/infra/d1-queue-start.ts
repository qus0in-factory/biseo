import type{D1Database}from'@cloudflare/workers-types'
import type{QueueLease}from'./d1-queue-fence.js'
export async function startTurn(db:D1Database,l:QueueLease){
 const r=await db.prepare(`UPDATE timeline_turns SET status='working',updated_at=?
 WHERE request_id=? AND lease_token=? AND lease_until>? AND status='queued'`)
  .bind(new Date(l.now).toISOString(),l.id,l.token,l.now).run()
 return !!r.meta.changes
}
