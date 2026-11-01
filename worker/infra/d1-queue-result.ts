import type{D1Database}from'@cloudflare/workers-types'
import type{TurnRecord}from'../domain/timeline-record.js'
import type{TimelineItem}from'../domain/timeline-types.js'
import{fencedUpdate}from'./d1-queue-fence.js'
import{QUEUE_RESULT_SET as Q}from'./d1-queue-result-sql.js'
import{renewTurn}from'./d1-queue-renew.js'
import{QUEUE_LEASE_MS}from'../domain/queue-policy.js'
export async function applyQueueResult(db:D1Database,r:TurnRecord,token:string,i:TimelineItem){
 const l={id:r.requestId,token,now:Date.now()}
 if(i.status==='queued'||i.status==='working'){await renewTurn(db,l,QUEUE_LEASE_MS);return r}
 const s=i.status==='timeout'?'failed':i.status,e=i.status==='timeout'?'delivery_uncertain':i.errorCode,at=i.completedAt??new Date().toISOString(),n=i.targetName&&i.targetName!==r.paneId?i.targetName:null
 const ok=await fencedUpdate(db,l,Q,[s,e,i.responseText,at,n??r.targetName,at])
 return ok?{...r,status:s,errorCode:e,responseText:i.responseText,completedAt:at,targetName:n??r.targetName}:r
}
