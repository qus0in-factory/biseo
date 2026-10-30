import type{UsageSnapshot,UsageState}from'../infra/d1-usage-types.js'
import{states,str}from'./usage-values.js'
import{windowSnapshot}from'./usage-window.js'
export function parseUsage(body:unknown,now=new Date().toISOString()):UsageSnapshot[]{
 if(!body||typeof body!=='object')return[]
 const b=body as {providers?:unknown;updatedAt?:unknown}
 if(!Array.isArray(b.providers))return[]
 const updatedAt=str(b.updatedAt)??now
 return b.providers.flatMap(v=>{
  if(!v||typeof v!=='object')return[]
  const p=v as Record<string,unknown>
  if(typeof p.provider!=='string'||!p.provider.trim())return[]
  const state=states.has(p.state as UsageState)?p.state as UsageState:'unknown'
  const list=(Array.isArray(p.metrics)&&p.metrics.length)?p.metrics:(Array.isArray(p.windows)?p.windows:[p])
  const items:(unknown[])=list.length?list:[{}]
  return items.flatMap(w=>w&&typeof w==='object'?[windowSnapshot(p.provider as string,state,p,w as Record<string,unknown>,updatedAt)]:[])
 })
}
