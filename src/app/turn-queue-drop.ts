import type{TimelineItem}from'../domain/timeline.js'
import type{TurnDeps}from'./turn-deps.js'
export function drop(d:Pick<TurnDeps,'queue'|'store'|'locks'>,i:TimelineItem,code:string){
 if(!d.queue.remove(i.requestId))return
 d.locks.releaseRequest(i.requestId)
 d.store.update(i.requestId,{status:'failed',errorCode:code,completedAt:new Date().toISOString()})
}
