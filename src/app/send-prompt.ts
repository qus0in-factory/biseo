import{promptError}from'./prompt-error.js'
import type{TurnStatus}from'../domain/timeline.js'
import type{CaptureReader,HerdrPort}from'./ports.js'
export type Sent={ok:true}|{ok:false;status:TurnStatus;errorCode:string}
export async function sendPrompt(h:HerdrPort,pane:string,text:string,reader:CaptureReader,acceptanceMs?:number):Promise<Sent>{
 try{
  await h.prompt(pane,text,15000,acceptanceMs)
  return{ok:true}
 }catch(e){
  const c=(e as{code?:string}).code
  if(c!=='agent_prompt_stalled'&&c!=='timeout'){
   const o=promptError(e,false)
   return{ok:false,...o}
  }
  if(await reader.confirm?.().catch(()=>false))return{ok:true}
  const a=await h.getAgent(pane).catch(()=>undefined)
  if(a?.agent_status==='working'||a?.agent_status==='blocked')return{ok:true}
  return{ok:false,status:'failed',errorCode:'prompt_not_accepted'}
 }
}
