import type{ProviderUsage,UsageSnapshot}from'../infra/d1-usage-types.js'
import{statusOnly}from'./usage-status.js'
import{snapshotMetric}from'./usage-snapshot-metric.js'
export function groupUsage(rows:UsageSnapshot[]):ProviderUsage[]{
 const map=new Map<string,ProviderUsage>()
 for(const r of rows){
  const p=map.get(r.provider)??{provider:r.provider,state:r.state,windows:[],metrics:[],reason:null,retryAt:null}
  if(!p.reason&&r.reason)p.reason=r.reason
  if(!p.retryAt&&r.retryAt)p.retryAt=r.retryAt
  p.windows.push({window:r.window,usedPercent:r.usedPercent,resetsAt:r.resetsAt,checkedAt:r.checkedAt,limitReached:r.limitReached,source:r.source})
  if(!statusOnly(r))p.metrics.push(snapshotMetric(r))
  map.set(r.provider,p)
 }
 return[...map.values()].sort((a,b)=>a.provider.localeCompare(b.provider))
}
