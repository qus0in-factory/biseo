import type{UsageMetric,UsageProvider}from'../domain/usage'
export const win=(id:string,u:number|null)=>({window:id,usedPercent:u,resetsAt:null,checkedAt:null,limitReached:false,source:null})
export const prov=(provider:string,windows:ReturnType<typeof win>[]):UsageProvider=>({provider,state:'available',windows})
export const percent=(id:string,used:number):UsageMetric=>({id,label:id,unit:'percent',used,limit:100,remaining:100-used,resetsAt:null})
