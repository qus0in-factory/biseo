import{makeItem}from'./turn-item.js'
import{beginReader,resolveTarget}from'./turn-queue-target.js'
import{claim,release}from'./turn-claim.js'
import{enqueue}from'./turn-queue-enqueue.js'
import{fail}from'./turn-result.js'
import type{TurnDeps}from'./turn-deps.js'
import type{TurnInput}from'./turn-input.js'
export async function attemptCreate(d:TurnDeps,i:TurnInput){
 const p=await resolveTarget(d,i)
 if(!('target'in p)){release(d,i.paneId,i.requestId);return p}
 const t=p.target
 if(p.issue==='agent_busy'||p.issue==='agent_blocked'||d.queue.has(i.paneId))return enqueue(d,i,t)
 if(p.issue){release(d,i.paneId,i.requestId);return fail(409,'target_not_ready',p.issue)}
 if(claim(d,i.paneId,i.requestId))return enqueue(d,i,t)
 const reader=await beginReader(d,i,t)
 if(!reader){release(d,i.paneId,i.requestId);return fail(409,'target_not_ready','response_capture_unavailable')}
 const item=makeItem(i,t,d.store.next())
 d.store.add(item)
 return{ok:true,item,reader,created:true,target:t}as const
}
