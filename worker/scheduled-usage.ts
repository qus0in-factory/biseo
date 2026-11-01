import type{D1Database}from'@cloudflare/workers-types'
import{callUpstreamJson}from'./infra/herdr-upstream-http.js'
import{parseUsage}from'./app/usage-sync.js'
import{upsertUsage}from'./infra/d1-usage-write.js'
import type{CronEnv}from'./scheduled-env.js'
import { historyConfig } from './app/usage-history-config.js'
import { historyPoints } from './app/usage-history-points.js'
import { writeHistory } from './infra/d1-usage-history-write.js'
export async function syncUsage(db:D1Database,env:CronEnv){
 const now=Date.now()
 const cutoff=now-historyConfig(env).retention
 const r=await callUpstreamJson<unknown>(env,'/herdr/usage','GET',undefined,crypto.randomUUID())
 if(!r.ok){await writeHistory(db,[],cutoff);return false}
 const rows=parseUsage(r.data)
 await upsertUsage(db,rows)
 await writeHistory(db,historyPoints(rows,now),cutoff)
 return true
}
