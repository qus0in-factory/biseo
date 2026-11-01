import type{D1Database}from'@cloudflare/workers-types'
import{fencedUpdate,type QueueLease}from'./d1-queue-fence.js'
export type QueueOutcome='completed'|'failed'|'cancelled'
export function finishTurn(
 db:D1Database,l:QueueLease,status:QueueOutcome,error:string|null=null,
){
 const at=new Date(l.now).toISOString()
 return fencedUpdate(db,l,`status=?,error_code=?,completed_at=?,updated_at=?,
 lease_token=NULL,lease_until=NULL`,[status,error,at,at])
}
