import type{TurnStore}from'./turn-store.js'
import type{TurnStatus}from'../domain/timeline.js'
import type{CaptureReader}from'./ports.js'
import{continueLate}from'./late-capture.js'
import{readResponse}from'./read-response.js'
export function finish(s:TurnStore,id:string,status:TurnStatus,errorCode:string|null,responseText:string|null=null){
 s.update(id,{status,errorCode,responseText,completedAt:new Date().toISOString()})
}
export async function awaitFinish(s:TurnStore,id:string,pane:string,gen:number,reader:CaptureReader,timeoutMs:number,lateMs:number|undefined){
 const r=await readResponse(reader,timeoutMs)
 if(r.error)return finish(s,id,'capture_unavailable','response_capture_unavailable')
 if(r.text)return finish(s,id,'completed',null,r.text)
 finish(s,id,'timeout','turn_timeout')
 continueLate(pane,gen,reader,lateMs,text=>{
  if(s.get(id)?.status==='timeout')finish(s,id,'completed',null,text)
 })
}
