import{parseUsage}from'../app/usage-sync.js'
import{groupUsage}from'../app/usage-group.js'
import{listUsage}from'../infra/d1-usage-read.js'
import{upsertUsage}from'../infra/d1-usage-write.js'
import{callUpstreamJson}from'../infra/herdr-upstream-http.js'
import{type App,jsonNoStore,requireOwner}from'./timeline-guards.js'
import{requireDb}from'./storage-guard.js'
export function registerUsageRoute(app:App){
 app.get('/api/usage',async c=>{
  const a=await requireOwner(c);if(!a.ok)return a.res
  const d=requireDb(c);if(!d.ok)return d.res
  const up=await callUpstreamJson<unknown>(c.env,'/herdr/usage','GET',undefined,crypto.randomUUID())
  if(up.ok)await upsertUsage(d.db,parseUsage(up.data))
  const rows=await listUsage(d.db)
  const lastSuccessAt=rows.reduce<string|null>((m,r)=>!m||r.updatedAt>m?r.updatedAt:m,null)
  return jsonNoStore(c,{providers:groupUsage(rows),stale:!up.ok,lastSuccessAt},200)
 })
}
