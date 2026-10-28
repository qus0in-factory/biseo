import ky,{TimeoutError}from'ky'
import type{UpstreamResult}from'../app/timeline-ports.js'
import {type UpstreamEnv,prepareUpstreamCall}from'./herdr-upstream-config.js'
import {parseUpstreamResponse}from'./herdr-upstream-parse.js'
import {logUpstream}from'./upstream-log.js'
export async function callUpstreamJson<T>(e:UpstreamEnv,p:string,m:'GET'|'POST',json:unknown,id:string):Promise<UpstreamResult<T>>{
 const c=await prepareUpstreamCall(e)
 if(!c)return {ok:false,status:502,body:{error:'misconfigured'}}
 const t0=Date.now(),headers={Authorization:`Bearer ${c.token}`,'x-request-id':id}
 try{
  const o={method:m,retry:0,timeout:c.timeoutMs,throwHttpErrors:false,headers,...(json!==undefined?{json}:{})}
  const out=await parseUpstreamResponse<T>(await ky(`${c.base}${p}`,o))
  logUpstream(id,m,p,out.status,t0)
  return out
 }catch(err){
  const s=err instanceof TimeoutError?504:502
  logUpstream(id,m,p,s,t0)
  return {ok:false,status:s,body:{error:s===504?'timeout':'bad_gateway'}}
 }
}
