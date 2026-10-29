import type{TimelineItem}from'../domain/timeline.js'
import{awaitFinish,finish}from'./finish-turn.js'
import{beginTurn}from'./pane-generation.js'
import type{CaptureReader,HerdrPort}from'./ports.js'
import{promptError}from'./prompt-error.js'
import type{TurnStore}from'./turn-store.js'
type Deps={herdr:HerdrPort;store:TurnStore;timeoutMs:number;lateCaptureMs?:number}
export async function captureTurn(d:Deps,item:TimelineItem,reader:CaptureReader){
 const id=item.requestId,gen=beginTurn(item.paneId)
 let sent=false
 try{
  await d.herdr.prompt(item.paneId,item.promptText,15000)
  sent=true
  const a=await d.herdr.getAgent(item.paneId)
  if(!a)return finish(d.store,id,'failed','delivery_uncertain')
  if(a.agent_status==='blocked')return finish(d.store,id,'blocked','agent_blocked')
  await awaitFinish(d.store,id,item.paneId,gen,reader,d.timeoutMs,d.lateCaptureMs)
 }catch(e){
  const o=promptError(e,sent)
  finish(d.store,id,o.status,o.errorCode)
 }
}
