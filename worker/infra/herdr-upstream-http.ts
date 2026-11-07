import ky,{TimeoutError}from'ky'
import type{UpstreamResult as R}from'../app/timeline-ports.js'
import {type UpstreamEnv,prepareUpstreamCall as pc}from'./herdr-upstream-config.js'
import {parseUpstreamResponse as pr}from'./herdr-upstream-parse.js'
import {logUpstream as lg}from'./upstream-log.js'
import {upstreamPolicy as up}from'./upstream-policy.js'
export async function callUpstreamJson<T>(e:UpstreamEnv,p:string,m:'GET'|'POST'|'DELETE',b:unknown,id:string):Promise<R<T>>{
 const c=await pc(e)
 if(!c)return{ok:false,status:502,body:{error:'misconfigured'}}
 const t0=Date.now(),h={Authorization:`Bearer ${c.token}`,'x-request-id':id}
 try{
  const o={method:m,throwHttpErrors:false,headers:h,...(b?{json:b}:{}),...up(id,m,p,c.timeoutMs)}
  const r=await pr<T>(await ky(`${c.base}${p}`,o))
  lg(id,m,p,r.status,t0,r.ok?undefined:r.body.error)
  return r
 }catch(e){
  const bad=e instanceof TimeoutError,s=bad?504:502,x=bad?'timeout':'bad_gateway'
  lg(id,m,p,s,t0,x)
  return{ok:false,status:s,body:{error:x}}
 }
}
