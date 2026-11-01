import type{D1Database}from'@cloudflare/workers-types'
import{QUEUE_MAX_ATTEMPTS,QUEUE_MAX_WAIT_MS}from'../domain/queue-policy.js'
export async function recoverQueue(db:D1Database,now=Date.now()){
 const at=new Date(now).toISOString()
 await db.prepare(`UPDATE timeline_turns SET status='failed',
 error_code=CASE WHEN status IN ('working','timeout') THEN 'delivery_uncertain'
 WHEN terminal_id IS NULL THEN 'target_unclear' ELSE 'retry_exhausted' END,
 completed_at=?,updated_at=?,lease_token=NULL,lease_until=NULL
 WHERE status='timeout' OR (status='working' AND (lease_until IS NULL OR lease_until<=? OR updated_at<?))
 OR (status='queued' AND (terminal_id IS NULL OR queue_attempts>=? OR created_at<?)
 AND (lease_until IS NULL OR lease_until<=?))`)
 .bind(at,at,now,new Date(now-QUEUE_MAX_WAIT_MS).toISOString(),QUEUE_MAX_ATTEMPTS,new Date(now-QUEUE_MAX_WAIT_MS).toISOString(),now).run()
}
