import type{D1Database}from'@cloudflare/workers-types'
import{callUpstreamJson}from'./infra/herdr-upstream-http.js'
import{parseUsage}from'./app/usage-sync.js'
import{upsertUsage}from'./infra/d1-usage-write.js'
import type{CronEnv}from'./scheduled-env.js'
export async function syncUsage(db:D1Database,env:CronEnv){
 const r=await callUpstreamJson<unknown>(env,'/herdr/usage','GET',undefined,crypto.randomUUID())
 if(!r.ok)return false
 await upsertUsage(db,parseUsage(r.data))
 return true
}
