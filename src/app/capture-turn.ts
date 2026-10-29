import type{TimelineItem as T}from'../domain/timeline.js'
import{awaitFinish,finish}from'./finish-turn.js'
import{beginTurn}from'./pane-generation.js'
import type{CaptureReader,HerdrPort}from'./ports.js'
import{sendPrompt}from'./send-prompt.js'
import type{TurnStore}from'./turn-store.js'
type D={herdr:HerdrPort;store:TurnStore;timeoutMs:number;lateCaptureMs?:number;promptAcceptanceMs?:number}
export async function captureTurn(d:D,item:T,r:CaptureReader){
 const id=item.requestId,gen=beginTurn(item.paneId)
 const s=await sendPrompt(d.herdr,item.paneId,item.promptText,r,d.promptAcceptanceMs)
 if(!s.ok)return finish(d.store,id,s.status,s.errorCode)
 const a=await d.herdr.getAgent(item.paneId)
 if(!a)return finish(d.store,id,'failed','delivery_uncertain')
 if(a.agent_status==='blocked')return finish(d.store,id,'blocked','agent_blocked')
 const chk=()=>d.herdr.getAgent(item.paneId).catch(()=>undefined)
 await awaitFinish(d.store,id,item.paneId,gen,r,d.timeoutMs,d.lateCaptureMs,chk)
}
