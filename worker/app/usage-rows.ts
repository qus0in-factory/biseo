import type{UsageSnapshot,UsageState}from'../infra/d1-usage-types.js'
import{states,str}from'./usage-values.js'
import{windowSnapshot}from'./usage-window.js'
import{emptyProviderSnapshot}from'./usage-empty.js'
export function providerSnapshots(v:unknown,updatedAt:string):UsageSnapshot[]{
 if(!v||typeof v!=='object')return[]
 const p=v as Record<string,unknown>
 if(typeof p.provider!=='string'||!p.provider.trim())return[]
 const provider=p.provider as string
 const state=states.has(p.state as UsageState)?p.state as UsageState:'unknown'
 const metrics=Array.isArray(p.metrics)?p.metrics:[]
 const windows=Array.isArray(p.windows)?p.windows:[]
 if(!metrics.length&&!windows.length)return[emptyProviderSnapshot(provider,state,p,updatedAt)]
 const list=metrics.length?metrics:windows.length?windows:[p]
 return list.flatMap(w=>w&&typeof w==='object'?[windowSnapshot(provider,state,p,w as Record<string,unknown>,updatedAt)]:[])
}
