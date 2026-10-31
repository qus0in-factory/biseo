import type{D1Database}from'@cloudflare/workers-types'
import{fencedUpdate,type QueueLease}from'./d1-queue-fence.js'
import{QUEUE_RETRY_MS}from'../domain/queue-policy.js'
export function parkTurn(db:D1Database,l:QueueLease,unavailable=false){
 return fencedUpdate(db,l,`queue_attempts=queue_attempts+?,lease_until=?`,[unavailable?1:0,l.now+QUEUE_RETRY_MS])
}
