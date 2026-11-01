import type{TurnDeps}from'./turn-deps.js'
import type{TurnInput}from'./turn-input.js'
import{queueTarget}from'./queue-target.js'
import{beginReader}from'./turn-queue-target.js'
import{makeItem}from'./turn-item.js'
import{runTurn}from'./run-turn.js'
export async function executeReservation(d:TurnDeps,i:TurnInput,terminal:string){
 const t=await queueTarget(d.herdr,i.workspaceId,i.paneId)
 if(!t||t.terminalId!==terminal||!t.ready)throw new Error('target_unclear')
 if(!d.locks.reserve(i.paneId,i.requestId))throw new Error('target_busy')
 try{
  const reader=await beginReader(d,i,t.target)
  if(!reader)throw new Error('response_capture_unavailable')
  const item=makeItem(i,t.target,d.store.next())
  d.store.add(item)
  void runTurn(d,item,reader,t.target)
  return item
 }catch(e){d.locks.release(i.paneId,i.requestId);throw e}
}
