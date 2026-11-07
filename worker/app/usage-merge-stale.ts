import type{UsageSnapshot}from'../infra/d1-usage-types.js'
import{isStaleReason,hasUsageValue,restoreStaleRow}from'./usage-stale-restore.js'
export function mergeUsageStale(rows:UsageSnapshot[],ext:UsageSnapshot[]):UsageSnapshot[]{
 const byProv=new Map<string,UsageSnapshot[]>()
 for(const e of ext){const l=byProv.get(e.provider)??[];l.push(e);byProv.set(e.provider,l)}
 const out:UsageSnapshot[]=[],handled=new Set<string>()
 for(const r of rows){
  const el=byProv.get(r.provider)
  if(!el?.length||!isStaleReason(r)||hasUsageValue(r)){out.push(r);continue}
  const m=el.find(e=>e.window===r.window||(e.metricId&&e.metricId===r.metricId))
  if(!m&&r.window==='status'){
   if(!handled.has(r.provider)){handled.add(r.provider);for(const e of el)out.push(restoreStaleRow(r,e))}
   continue
  }
  out.push(m?restoreStaleRow(r,m):r)
 }
 return out
}
