import type{ProviderUsage,UsageSnapshot}from'../infra/d1-usage-types.js'
export function groupUsage(rows:UsageSnapshot[]):ProviderUsage[]{
 const map=new Map<string,ProviderUsage>()
 for(const r of rows){
  const p=map.get(r.provider)??{provider:r.provider,state:r.state,windows:[]}
  p.windows.push({window:r.window,usedPercent:r.usedPercent,resetsAt:r.resetsAt,checkedAt:r.checkedAt,limitReached:r.limitReached,source:r.source})
  map.set(r.provider,p)
 }
 return[...map.values()].sort((a,b)=>a.provider.localeCompare(b.provider))
}
