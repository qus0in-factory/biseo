import type{D1Database}from'@cloudflare/workers-types'
import type{TurnRecord}from'../domain/timeline-record.js'
import type{TimelineItem}from'../domain/timeline-types.js'
import{fencedUpdate}from'./d1-queue-fence.js'
import{renewTurn}from'./d1-queue-renew.js'
import{QUEUE_LEASE_MS}from'../domain/queue-policy.js'
export async function applyQueueResult(db:D1Database,r:TurnRecord,token:string,i:TimelineItem){
 const l={id:r.requestId,token,now:Date.now()}
 if(i.status==='queued'||i.status==='working'){await renewTurn(db,l,QUEUE_LEASE_MS);return r}
 const status=i.status==='timeout'?'failed':i.status
 const error=i.status==='timeout'?'delivery_uncertain':i.errorCode
 const at=i.completedAt??new Date().toISOString()
 const ok=await fencedUpdate(db,l,`status=?,error_code=?,response_text=?,completed_at=?,
 updated_at=?,lease_token=NULL,lease_until=NULL`,[status,error,i.responseText,at,at])
 return ok?{...r,status,errorCode:error,responseText:i.responseText,completedAt:at}:r
}
