import ky,{TimeoutError}from'ky'
import type{UpstreamResult}from'../app/timeline-ports.js'
import {type UpstreamEnv,prepareUpstreamCall as pc}from'./herdr-upstream-config.js'
import {parseUpstreamResponse as pr}from'./herdr-upstream-parse.js'
import {logUpstream as lg}from'./upstream-log.js'
import {upstreamRetry}from'./herdr-upstream-retry.js'
export async function callUpstreamJson<T>(e:UpstreamEnv,p:string,m:'GET'|'POST'|'DELETE',json:unknown,id:string):Promise<UpstreamResult<T>>{
 const c=await pc(e)
 if(!c)return{ok:false,status:502,body:{error:'misconfigured'}}
 const t0=Date.now(),headers={Authorization:`Bearer ${c.token}`,'x-request-id':id}
 try{
  const o={method:m,timeout:c.timeoutMs,throwHttpErrors:false,headers,...(json?{json}:{}),...upstreamRetry(id,m,p)}
  const out=await pr<T>(await ky(`${c.base}${p}`,o))
  lg(id,m,p,out.status,t0)
  return out
 }catch(e){
  const s=e instanceof TimeoutError?504:502
  lg(id,m,p,s,t0)
  return {ok:false,status:s,body:{error:s===504?'timeout':'bad_gateway'}}
 }
}
