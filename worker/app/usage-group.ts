import type{ProviderUsage,UsageMetric,UsageSnapshot}from'../infra/d1-usage-types.js'
export function groupUsage(rows:UsageSnapshot[]):ProviderUsage[]{
 const map=new Map<string,ProviderUsage>()
 for(const r of rows){
  const p=map.get(r.provider)??{provider:r.provider,state:r.state,windows:[],metrics:[],reason:null,retryAt:null}
  if(!p.reason&&r.reason)p.reason=r.reason
  if(!p.retryAt&&r.retryAt)p.retryAt=r.retryAt
  p.windows.push({window:r.window,usedPercent:r.usedPercent,resetsAt:r.resetsAt,checkedAt:r.checkedAt,limitReached:r.limitReached,source:r.source})
  const m:UsageMetric={
   id:r.metricId??r.window,
   label:r.label??r.metricId??r.window,
   unit:r.unit??'percent',
   used:r.used??r.usedPercent,
   limit:r.limitValue??100,
   remaining:r.remaining??(r.usedPercent!==null?Math.max(0,100-r.usedPercent):null),
   resetsAt:r.resetsAt
  }
  p.metrics.push(m)
  map.set(r.provider,p)
 }
 return[...map.values()].sort((a,b)=>a.provider.localeCompare(b.provider))
}
