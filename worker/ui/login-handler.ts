import type{Context}from'hono'
import{login}from'../app/login.js'
import{checkRateLimit}from'./rate-limit.js'
import{createLoginDeps}from'./login-deps.js'
import{resetPinLock}from'./pin-reset.js'
import type{SessionBindings}from'./types.js'
import{completeLogin}from'./complete-login.js'
export async function handleLogin(c:Context<{Bindings:SessionBindings}>){
 try{
  const rl=await checkRateLimit(c)
  if(!rl.ok)return c.json({error:rl.error},rl.status)
  const deps=await createLoginDeps(c.env)
  if(!deps)return c.json({error:'misconfigured'},500)
  const body=await c.req.json().catch(()=>null) as{password?:unknown}
  const res=await login(deps,body?.password)
  if(!res.ok){await rl.store.increment(rl.key,rl.ttl);return c.json({error:'unauthorized'},401)}
  await rl.store.clear(rl.key)
  await resetPinLock(c.env)
  return completeLogin(c,'password',res.token)
 }catch{return c.json({error:'misconfigured'},500)}
}
