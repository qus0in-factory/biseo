import type{TimelineItem as T}from'../domain/timeline.js'
import{awaitFinish,finish}from'./finish-turn.js'
import{beginTurn}from'./pane-generation.js'
import type{CaptureReader}from'./ports.js'
import{sendPrompt}from'./send-prompt.js'
import{turnBlockedError}from'./turn-blocked-error.js'
import type{CaptureTurnDeps as D}from'./capture-turn-deps.js'
import{finishTurnResult}from'./finish-turn-result.js'
export async function captureTurn(d:D,item:T,r:CaptureReader){
 const id=item.requestId,gen=beginTurn(item.paneId)
 const s=await sendPrompt(d.herdr,item.paneId,item.promptText,r,d.promptAcceptanceMs)
 if(!s.ok)return finishTurnResult(d,item,s)
 const a=await d.herdr.getAgent(item.paneId)
 if(!a)return finish(d.store,id,'failed','delivery_uncertain')
 const blockedError=()=>turnBlockedError(d,item.paneId,a)
 if(a.agent_status==='blocked')return finish(d.store,id,'blocked',await blockedError())
 const chk=()=>d.herdr.getAgent(item.paneId).catch(()=>undefined)
 await awaitFinish(d.store,id,item.paneId,gen,r,d.timeoutMs,d.lateCaptureMs,chk,blockedError)
}
