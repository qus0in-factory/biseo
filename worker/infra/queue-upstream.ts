import type{QueuePort,QueueTarget}from'../app/queue-port.js'
import type{UpstreamEnv}from'./herdr-upstream-config.js'
import{callUpstreamJson as call}from'./herdr-upstream-http.js'
export function queueUpstream(env:UpstreamEnv):QueuePort{
 const id=crypto.randomUUID()
 return{
  target:async(w,p)=>{
   const r=await call<QueueTarget>(env,`/herdr/queue/workspaces/${encodeURIComponent(w)}/panes/${encodeURIComponent(p)}`,'GET',undefined,id)
   if(r.ok&&typeof r.data.terminalId==='string'&&r.data.terminalId&&typeof r.data.ready==='boolean')return r.data
   if(r.status===404)return null
   throw new Error('target_unavailable')
  },
  execute:async(r,token)=>(await call(env,'/herdr/queue/execute','POST',{
   requestId:r.requestId,workspaceId:r.workspaceId,paneId:r.paneId,text:r.promptText,terminalId:r.terminalId,queueToken:token,
  },id)).ok,
 }
}
