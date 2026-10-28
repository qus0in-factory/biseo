import {type UpstreamEnv,prepareUpstreamCall}from'./herdr-upstream-config.js'
import {logUpstream}from'./upstream-log.js'
export async function openUpstreamEvents(env:UpstreamEnv,wsId:string,lastEventId?:string|null,signal?:AbortSignal,reqId:string=crypto.randomUUID()):Promise<Response|{status:502;error:string}>{
 const cfg=await prepareUpstreamCall(env)
 if(!cfg)return {status:502,error:'misconfigured'}
 const headers:Record<string,string>={Authorization:`Bearer ${cfg.token}`,Accept:'text/event-stream','x-request-id':reqId}
 if(lastEventId)headers['Last-Event-ID']=lastEventId
 const t0=Date.now()
 try{
  const res=await fetch(`${cfg.base}/herdr/events?workspaceId=${encodeURIComponent(wsId)}`,{headers,signal})
  const ok=res.ok&&Boolean(res.body)
  logUpstream(reqId,'GET','/herdr/events',ok?res.status:502,t0)
  return ok?res:{status:502,error:'bad_gateway'}
 }catch{
  logUpstream(reqId,'GET','/herdr/events',502,t0)
  return {status:502,error:'bad_gateway'}
 }
}
