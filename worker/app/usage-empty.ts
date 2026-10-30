import type{UsageSnapshot,UsageState}from'../infra/d1-usage-types.js'
const text=(v:unknown)=>typeof v==='string'&&v.trim()?v.trim():null
export function emptyProviderSnapshot(provider:string,state:UsageState,p:Record<string,unknown>,updatedAt:string):UsageSnapshot{
 return{
  provider,window:'status',state,usedPercent:null,resetsAt:null,
  checkedAt:text(p.checkedAt),limitReached:false,source:text(p.source),updatedAt,
  metricId:'status',label:'status',unit:'percent',used:null,limitValue:null,remaining:null,
  reason:text(p.reason),retryAt:text(p.retryAt)
 }
}
