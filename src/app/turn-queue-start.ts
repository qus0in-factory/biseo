import{prepare}from'./prepare-turn.js'
import{runTurn}from'./run-turn.js'
import{drop}from'./turn-queue-drop.js'
import type{TurnDeps}from'./turn-deps.js'
import type{TimelineItem}from'../domain/timeline.js'
export async function start(d:TurnDeps,i:TimelineItem):Promise<'started'|'wait'|'failed'>{
 const p=await prepare(d,{requestId:i.requestId,workspaceId:i.workspaceId,paneId:i.paneId,text:i.promptText}).catch(()=>({wait:true}as const))
 if('wait' in p)return'wait'
 if('ok' in p){
  if(p.reason==='agent_busy'||p.reason==='agent_blocked')return'wait'
  drop(d,i,p.reason??p.error)
  return'failed'
 }
 if(!p.reader){drop(d,i,'response_capture_unavailable');return'failed'}
 if(d.queue.peek(i.paneId)?.requestId!==i.requestId){p.reader.close?.();return'wait'}
 d.queue.shift(i.paneId)
 void runTurn(d,i,p.reader,p.target).catch(()=>{})
 return'started'
}
