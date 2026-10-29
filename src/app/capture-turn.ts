import type{TimelineItem}from'../domain/timeline.js'
import{awaitFinish,finish}from'./finish-turn.js'
import{beginTurn}from'./pane-generation.js'
import type{CaptureReader,HerdrPort}from'./ports.js'
import{sendPrompt}from'./send-prompt.js'
import type{TurnStore}from'./turn-store.js'
type Deps={herdr:HerdrPort;store:TurnStore;timeoutMs:number;lateCaptureMs?:number;promptAcceptanceMs?:number}
export async function captureTurn(d:Deps,item:TimelineItem,reader:CaptureReader){
 const id=item.requestId,gen=beginTurn(item.paneId)
 const s=await sendPrompt(d.herdr,item.paneId,item.promptText,reader,d.promptAcceptanceMs)
 if(!s.ok)return finish(d.store,id,s.status,s.errorCode)
 const a=await d.herdr.getAgent(item.paneId)
 if(!a)return finish(d.store,id,'failed','delivery_uncertain')
 if(a.agent_status==='blocked')return finish(d.store,id,'blocked','agent_blocked')
 await awaitFinish(d.store,id,item.paneId,gen,reader,d.timeoutMs,d.lateCaptureMs)
}
