import{stateWithGrace}from'./turn-queue-state-grace.js'
import{start}from'./turn-queue-start.js'
import{drop}from'./turn-queue-drop.js'
import{release}from'./turn-claim.js'
import type{TurnDeps}from'./turn-deps.js'
export async function dispatchPane(d:TurnDeps,pane:string):Promise<void>{
 if(!d.queue.has(pane)||!d.queue.begin(pane))return
 try{
  for(;;){
   if(!d.queue.has(pane)||d.locks.has(pane))return
   const i=d.queue.peek(pane)!
   const s=await stateWithGrace(d.herdr,pane,d.targetGraceMs??0).catch(()=>({wait:true}as const))
   if(d.queue.peek(pane)?.requestId!==i.requestId)continue
   if('wait' in s)return
   if('reason' in s){drop(d,i,s.reason);continue}
   if(!d.locks.reserve(pane,i.requestId))return
   const r=await start(d,i).catch(()=>'wait'as const)
   if(r==='started')return
   release(d,pane,i.requestId)
   if(r==='wait')return
  }
 }finally{if(d.queue.end(pane))void dispatchPane(d,pane)}
}
