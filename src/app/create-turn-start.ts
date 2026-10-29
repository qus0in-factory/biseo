import{makeItem}from'./turn-item.js'
import{beginReader}from'./turn-queue-target.js'
import{claim,release}from'./turn-claim.js'
import{enqueue}from'./turn-queue-enqueue.js'
import{fail}from'./turn-result.js'
import type{Target}from'../domain/turn-policy.js'
import type{TurnDeps}from'./turn-deps.js'
import type{TurnInput}from'./turn-input.js'
export async function startCreate(d:TurnDeps,i:TurnInput,t:Target){
 if(claim(d,i.paneId,i.requestId))return enqueue(d,i,t)
 const reader=await beginReader(d,i,t)
 if(!reader){release(d,i.paneId,i.requestId);return fail(409,'target_not_ready','response_capture_unavailable')}
 const item=makeItem(i,t,d.store.next())
 d.store.add(item)
 return{ok:true,item,reader,created:true,target:t}as const
}
