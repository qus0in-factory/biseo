import{dispatchPane}from'./turn-queue-dispatch.js'
import type{TurnDeps}from'./turn-deps.js'
const bound=new WeakSet<object>()
export function dispatchAll(d:TurnDeps){for(const p of d.queue.panes())void dispatchPane(d,p)}
export function queueEvent(d:TurnDeps,e:string){
 if(!/agent_status|pane_updated/.test(e.replace(/\./g,'_')))return
 dispatchAll(d)
}
export function bindQueue(d:TurnDeps){
 if(bound.has(d))return
 bound.add(d)
 d.locks.subscribe(p=>{if(d.queue.has(p))void dispatchPane(d,p)})
}
