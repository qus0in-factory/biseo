import type{LateOpts}from'./late-types.js'
import{mapAgentSignal}from'./late-agent-status.js'
import{isCurrentTurn}from'./pane-generation.js'
import{readResponse}from'./read-response.js'
export async function pollLateStep(o:LateOpts,budget:number):Promise<boolean>{
 const r=await readResponse(o.rdr,budget)
 if(!o.isLive())return false
 if(r.text){o.onDone('completed',null,r.text);return false}
 if(o.chk){
  const sig=mapAgentSignal(await o.chk().catch(()=>undefined))
  if(sig&&isCurrentTurn(o.pane,o.gen)&&o.isLive()){o.onDone(sig.status,sig.err);return false}
 }
 if(r.error){o.onDone('capture_unavailable','response_capture_unavailable');return false}
 return true
}
