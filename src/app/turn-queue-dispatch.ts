import{stateWithGrace}from'./turn-queue-state-grace.js'
import{start}from'./turn-queue-start.js'
import{drop}from'./turn-queue-drop.js'
import{release}from'./turn-claim.js'
import{retryAt}from'./availability-retry.js'
import type{TurnDeps}from'./turn-deps.js'
export async function dispatchPane(d:TurnDeps,p:string){
 if(!d.queue.has(p)||!d.queue.begin(p))return
 try{
  for(;;){
   if(!d.queue.has(p)||d.locks.has(p))return
   const i=d.queue.peek(p)!
   const s=await stateWithGrace(d,p,d.targetGraceMs??0).catch(()=>({wait:true}as const))
   if(d.queue.peek(p)?.requestId!==i.requestId)continue
   if('wait' in s)return
   if('reason' in s){drop(d,i,s.reason);continue}
   if('limited' in s){retryAt(p,s.limited,()=>void dispatchPane(d,p));return}
   if(!d.locks.reserve(p,i.requestId))return
   const r=await start(d,i).catch(()=>'wait'as const)
   if(r==='started')return
   release(d,p,i.requestId)
   if(r==='wait')return
  }
 }finally{if(d.queue.end(p))void dispatchPane(d,p)}
}
