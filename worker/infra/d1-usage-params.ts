import type{UsageSnapshot}from'./d1-usage-types.js'
export const usageParams=(r:UsageSnapshot)=>[
 r.provider,r.window,r.state,r.usedPercent,r.resetsAt,r.checkedAt,r.limitReached?1:0,r.source,r.updatedAt,
 r.metricId??r.window,r.label??r.metricId??r.window,r.unit??'percent',r.used??r.usedPercent,
 r.limitValue??(r.unit==='percent'?100:null),
 r.remaining??(r.unit==='percent'&&r.usedPercent!==null?Math.max(0,100-r.usedPercent):null),
 r.reason??null,r.retryAt??null,r.startsAt??null
]
