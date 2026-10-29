import type{TimelineItem}from'../domain/timeline.js'
import type{TurnDeps}from'./turn-deps.js'
import{clearRetry}from'./availability-retry.js'
export type Cancelled={ok:true;item:TimelineItem}|{ok:false;status:404|409;error:string}
export function cancelTurn(d:Pick<TurnDeps,'queue'|'store'|'locks'>,id:string):Cancelled{
 const i=d.store.get(id)
 if(!i)return{ok:false,status:404,error:'not_found'}
 if(i.status!=='queued'||!d.queue.remove(id))return{ok:false,status:409,error:'not_cancellable'}
 clearRetry(i.paneId)
 d.store.update(id,{status:'cancelled',completedAt:new Date().toISOString()})
 d.locks.releaseRequest(id)
 return{ok:true,item:d.store.get(id)!}
}
