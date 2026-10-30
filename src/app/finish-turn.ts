import type{CaptureReader}from'./ports.js'
import type{AgentInfo}from'../domain/herdr.js'
import type{TurnStatus as S}from'../domain/timeline.js'
import type{TurnStore}from'./turn-store.js'
import{continueLate}from'./late-capture.js'
import{readResponse}from'./read-response.js'
import{finish}from'./finish-turn-record.js'
export{finish}
export async function awaitFinish(s:TurnStore,id:string,pane:string,gen:number,rdr:CaptureReader,timeoutMs:number,lateMs:number|undefined,chk?:()=>Promise<AgentInfo|undefined>){
 const r=await readResponse(rdr,timeoutMs)
 if(r.error)return finish(s,id,'capture_unavailable','response_capture_unavailable')
 if(r.text)return finish(s,id,'completed',null,r.text)
 finish(s,id,'timeout','turn_timeout')
 const live=()=>{const i=s.get(id);return i?.status==='timeout'&&i.errorCode!=='late_capture_expired'}
 continueLate({pane,gen,rdr,ms:lateMs,chk,isLive:live,onDone:(st,e,t)=>finish(s,id,st,e,t)})
}
