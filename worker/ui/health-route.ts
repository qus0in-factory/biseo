import ky,{TimeoutError}from'ky'
import {createServiceToken}from'../infra/service-token.js'
import {logUpstream,resolveRequestId}from'../infra/upstream-log.js'
import {verifySession}from'./session.js'
import type{App}from'./timeline-guards.js'
export function registerHealthRoute(app:App){
 app.get('/api/health',async c=>{
  const a=await verifySession(c)
  if(!a.ok)return c.json({error:'unauthorized'},a.status)
  const u=c.env.FUNNEL_HEALTH_URL,ms=Number(c.env.HEALTH_TIMEOUT_MS),t=await createServiceToken(c.env)
  if(!u||!(ms>0)||!t)return c.json({error:'misconfigured'},502)
  const id=resolveRequestId(c),t0=Date.now()
  try{
   const b=await ky.get(u,{retry:0,timeout:ms,headers:{Authorization:`Bearer ${t}`,'x-request-id':id}}).json()
   logUpstream(id,'GET','/health',200,t0)
   return c.json(b)
  }catch(e){
   const s=e instanceof TimeoutError?504:502
   logUpstream(id,'GET','/health',s,t0)
   return c.json({error:s===504?'timeout':'bad_gateway'},s)
  }
 })
}
