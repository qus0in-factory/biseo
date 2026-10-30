import{dispatchAll,queueEvent}from'../app/turn-queue-bind.js'
import{PaneLocks}from'../app/pane-locks.js'
import{TurnQueue}from'../app/turn-queue.js'
import{TurnStore}from'../app/turn-store.js'
import type{TurnDeps}from'../app/turn-deps.js'
import{logger}from'./logger.js'
import{subscribe}from'./herdr-events.js'
import{startHerdrWatch}from'./herdr-watch.js'
export function createState(){return{store:new TurnStore(),locks:new PaneLocks(),queue:new TurnQueue()}}
export function startQueueWatch(d:TurnDeps){
 const ws=d.allowedWorkspaceId
 if(!ws){logger.warn({reason:'allowed_workspace_id_missing'},'herdr.watch.disabled');return}
 const w=startHerdrWatch({
  listPanes:async()=> d.allowedWorkspaceId?(await d.herdr.listPanes(d.allowedWorkspaceId)).map(p=>p.pane_id):[],
  subscribe,
  onEvent:e=>queueEvent(d,e),
  onReady:()=>dispatchAll(d),
  onError:e=>logger.warn({err:e},'herdr.watch.retry'),
 })
 d.watch=()=>w.refresh()
 let current=ws
 const timer=setInterval(()=>{const next=d.allowedWorkspaceId;if(next!==current){current=next!;w.refresh();dispatchAll(d)}},1000)
 timer.unref()
 const stop=()=>{clearInterval(timer);w.stop();process.exit(0)}
 process.once('SIGTERM',stop)
 process.once('SIGINT',stop)
}
