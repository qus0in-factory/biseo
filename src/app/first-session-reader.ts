import{isFirstSession}from'../domain/first-session.js'
import{beginOpencodeFromStart}from'../infra/opencode-capture.js'
import{subscribe}from'../infra/herdr-events.js'
import{waitFirstSession}from'./wait-first-session.js'
import type{EventSub}from'./first-session-snap.js'
import type{Target}from'../domain/turn-policy.js'
import type{CaptureReader,HerdrPort}from'./ports.js'
type D={herdr:HerdrPort;firstSessionMs?:number;promptAcceptanceMs?:number;sub?:EventSub}
export function beginFirstReader(d:D,t:Target,q:string):CaptureReader|null{
 if(!isFirstSession(t))return null
 let shut=false
 const ms=d.firstSessionMs??d.promptAcceptanceMs??8000
 const sub=d.sub??subscribe
 return{
  read:async(left:number)=>{
   const s=await waitFirstSession(d.herdr,t.pane.pane_id,t.pane.terminal_id,ms,()=>shut,sub)
   const r=s?beginOpencodeFromStart(s.value,q):null
   if(!r)throw new Error('first_session_unavailable')
   return r.read(left)
  },
  confirm:async()=>false,
  close:()=>{shut=true},
 }
}
