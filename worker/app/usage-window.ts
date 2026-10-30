import type{UsageSnapshot,UsageState}from'../infra/d1-usage-types.js'
import{pct,str}from'./usage-values.js'
import{rowLimitReached}from'./usage-row-limit.js'
import{rowMetric}from'./usage-row-metric.js'
export function windowSnapshot(provider:string,state:UsageState,p:Record<string,unknown>,w:Record<string,unknown>,updatedAt:string):UsageSnapshot{
 const metricId=str(w.metricId)??str(w.id)??str(w.window)??'default'
 const label=str(w.label)??metricId
 const[unit,used,limitValue,remaining]=rowMetric(w)
 return{
  provider,window:str(w.window)??metricId,state,
  usedPercent:pct(w.usedPercent)??(unit==='percent'?used:null),
  resetsAt:str(w.resetsAt)??str(p.resetsAt),
  checkedAt:str(w.checkedAt)??str(p.checkedAt),
  limitReached:rowLimitReached(w.limitReached,unit,used,w.limit,remaining),
  source:str(w.source)??str(p.source),
  updatedAt,
  metricId,label,unit,used,limitValue,remaining
 }
}
