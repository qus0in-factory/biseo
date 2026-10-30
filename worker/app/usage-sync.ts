import type{UsageSnapshot}from'../infra/d1-usage-types.js'
import{str}from'./usage-values.js'
import{providerSnapshots}from'./usage-rows.js'
export function parseUsage(body:unknown,now=new Date().toISOString()):UsageSnapshot[]{
 if(!body||typeof body!=='object')return[]
 const b=body as {providers?:unknown;updatedAt?:unknown}
 if(!Array.isArray(b.providers))return[]
 const updatedAt=str(b.updatedAt)??now
 return b.providers.flatMap(v=>providerSnapshots(v,updatedAt))
}
