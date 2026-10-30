import type{D1Database}from'@cloudflare/workers-types'
import type{UsageSnapshot,UsageState}from'./d1-usage-types.js'
const Q='SELECT provider,window,state,used_percent,resets_at,checked_at,limit_reached,source,updated_at,metric_id,label,unit,used,limit_value,remaining FROM usage_snapshots ORDER BY provider,window'
const num=(v:unknown)=>typeof v==='number'?v:null
export async function listUsage(db:D1Database){
 const x=await db.prepare(Q).all<Record<string,unknown>>()
 return (x.results??[]).map(r=>({
  provider:String(r.provider),window:String(r.window),state:r.state as UsageState,
  usedPercent:num(r.used_percent),resetsAt:r.resets_at as string|null,
  checkedAt:r.checked_at as string|null,limitReached:!!r.limit_reached,
  source:r.source as string|null,updatedAt:String(r.updated_at),
  metricId:r.metric_id as string|null,label:r.label as string|null,
  unit:r.unit as string|null,used:num(r.used),limitValue:num(r.limit_value),remaining:num(r.remaining)
 }) as UsageSnapshot)
}
