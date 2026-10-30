import type{D1Database}from'@cloudflare/workers-types'
import type{UsageSnapshot}from'./d1-usage-types.js'
import{usageRow}from'./d1-usage-row.js'
const Q='SELECT provider,window,state,used_percent,resets_at,checked_at,limit_reached,source,updated_at,metric_id,label,unit,used,limit_value,remaining,reason,retry_at FROM usage_snapshots ORDER BY provider,window'
export async function listUsage(db:D1Database){
 const x=await db.prepare(Q).all<Record<string,unknown>>()
 return(x.results??[]).map(usageRow)as UsageSnapshot[]
}
