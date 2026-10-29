import{stateWithGrace}from'./turn-queue-state-grace.js'
import{start}from'./turn-queue-start.js'
import{drop}from'./turn-queue-drop.js'
import{release}from'./turn-claim.js'
import{retryAt,clearRetry}from'./availability-retry.js'
import{retrySoon,clearSoon}from'./dispatch-retry.js'
import type{TurnDeps}from'./turn-deps.js'
export async function runQueue(d:TurnDeps,p:string,go:()=>void){
 const q=d.queue,ms=d.queueParkMs??2000
 for(;;){
  if(!q.has(p)||d.locks.has(p))return
  const i=q.peek(p)!
  const s=await stateWithGrace(d,p,d.targetGraceMs??0).catch(()=>null)
  if(q.peek(p)?.requestId!==i.requestId)continue
  if(!s||'wait'in s){retrySoon(p,go,ms);return}
  if('reason' in s){drop(d,i,s.reason);continue}
  if('limited' in s){retryAt(p,s.limited,go);return}
  if(!d.locks.reserve(p,i.requestId))return
  const r=await start(d,i).catch(()=>'error'as const)
  if(r==='started'){clearRetry(p);clearSoon(p);return}
  release(d,p,i.requestId)
  if(r==='failed')continue
  retrySoon(p,go,ms);return
 }
}
