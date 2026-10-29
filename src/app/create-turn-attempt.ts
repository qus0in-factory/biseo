import{resolveTarget}from'./turn-queue-target.js'
import{release}from'./turn-claim.js'
import{enqueue}from'./turn-queue-enqueue.js'
import{isLimited}from'../domain/availability.js'
import{targetAvailability}from'./target-availability.js'
import{fail}from'./turn-result.js'
import{startCreate}from'./create-turn-start.js'
import type{TurnDeps}from'./turn-deps.js'
import type{TurnInput}from'./turn-input.js'
export async function attemptCreate(d:TurnDeps,i:TurnInput){
 const p=await resolveTarget(d,i)
 if(!('target'in p)){release(d,i.paneId,i.requestId);return p}
 const t=p.target
 const av=await targetAvailability(d,t)
 if(isLimited(av)){release(d,i.paneId,i.requestId);return fail(409,'target_not_ready','provider_rate_limited',av.resetsAt??undefined)}
 if(p.issue==='agent_busy'||p.issue==='agent_blocked'||d.queue.has(i.paneId))return enqueue(d,i,t)
 if(p.issue){release(d,i.paneId,i.requestId);return fail(409,'target_not_ready',p.issue)}
 return startCreate(d,i,t)
}
