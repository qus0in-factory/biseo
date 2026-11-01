import type{Context}from'hono'
import{pinLogin}from'../app/pin-login.js'
import{createPinDeps}from'./pin-deps.js'
import{resolvePinRequest}from'./pin-request.js'
import{checkCsrf,jsonNoStore}from'./timeline-guards.js'
import type{SessionBindings}from'./types.js'
import{completeLogin}from'./complete-login.js'
export async function handlePinLogin(c:Context<{Bindings:SessionBindings}>){
 const csrf=checkCsrf(c)
 if(csrf)return csrf
 const req=resolvePinRequest(c)
 if(!req)return jsonNoStore(c,{error:'forbidden'},403)
 const deps=await createPinDeps(c.env,req.ip)
 if(!deps)return jsonNoStore(c,{error:'misconfigured'},500)
 const body=await c.req.json().catch(()=>null) as{pin?:unknown}
 const res=await pinLogin({...deps,limits:req},body?.pin)
 if(!res.ok)return jsonNoStore(c,{error:res.status===429?'rate_limit_exceeded':'unauthorized'},res.status)
 return completeLogin(c,'pin',res.token,req.sessionTtl)
}
