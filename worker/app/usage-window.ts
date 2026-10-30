import type{UsageSnapshot,UsageState}from'../infra/d1-usage-types.js'
import{pct,str}from'./usage-values.js'
export function windowSnapshot(provider:string,state:UsageState,p:Record<string,unknown>,w:Record<string,unknown>,updatedAt:string):UsageSnapshot{
 const metricId=str(w.metricId)??str(w.id)??str(w.window)??'default'
 const label=str(w.label)??metricId
 const unit=str(w.unit)??'percent'
 const used=typeof w.used==='number'?w.used:pct(w.usedPercent)
 const limitValue=typeof w.limit==='number'?w.limit:100
 const remaining=typeof w.remaining==='number'?w.remaining:(used!==null?Math.max(0,100-used):null)
 return{
  provider,window:str(w.window)??metricId,state,
  usedPercent:pct(w.usedPercent)??(unit==='percent'?used:null),
  resetsAt:str(w.resetsAt)??str(p.resetsAt),
  checkedAt:str(w.checkedAt)??str(p.checkedAt),
  limitReached:w.limitReached===true||p.limitReached===true||state==='limited',
  source:str(w.source)??str(p.source),
  updatedAt,
  metricId,label,unit,used,limitValue,remaining
 }
}
