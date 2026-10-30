import type{UsageSnapshot,UsageState}from'../infra/d1-usage-types.js'
import{pct,str}from'./usage-values.js'
export function windowSnapshot(provider:string,state:UsageState,p:Record<string,unknown>,w:Record<string,unknown>,updatedAt:string):UsageSnapshot{
 return{
  provider,window:str(w.window)??'default',state,
  usedPercent:pct(w.usedPercent),
  resetsAt:str(w.resetsAt)??str(p.resetsAt),
  checkedAt:str(w.checkedAt)??str(p.checkedAt),
  limitReached:w.limitReached===true||p.limitReached===true||state==='limited',
  source:str(w.source)??str(p.source),
  updatedAt,
 }
}
