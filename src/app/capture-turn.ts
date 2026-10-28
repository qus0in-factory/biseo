import type{TimelineItem,TurnStatus}from'../domain/timeline.js'
import{finish}from'./finish-turn.js'
import type{CaptureReader,HerdrPort}from'./ports.js'
import {postIssue}from'./post-issue.js'
import {promptError}from'./prompt-error.js'
import {readResponse}from'./read-response.js'
import type{TurnStore}from'./turn-store.js'
type Deps={herdr:HerdrPort;store:TurnStore;timeoutMs:number;graceMs:number}
export async function captureTurn(d:Deps,item:TimelineItem,reader:CaptureReader){
 const id=item.requestId
 const f=(s:TurnStatus,e:string|null,t:string|null=null)=>finish(d.store,id,s,e,t)
 let sent=false
 try{
  await d.herdr.prompt(item.paneId,item.promptText,d.timeoutMs)
  sent=true
  const issue=postIssue(await d.herdr.getAgent(item.paneId));if(issue)return f(issue.status,issue.errorCode)
  const text=await readResponse(reader,d.graceMs);return text?f('completed',null,text):f('capture_unavailable','response_capture_unavailable')
 }catch(e){
  const o=promptError(e,sent)
  return f(o.status,o.errorCode)
 }
}
