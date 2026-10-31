import type{UsageSnapshot,UsageState}from'./d1-usage-types.js'
const num=(v:unknown)=>typeof v==='number'?v:null
const text=(v:unknown)=>typeof v==='string'?v:null
export const usageRow=(r:Record<string,unknown>):UsageSnapshot=>({
 provider:String(r.provider),window:String(r.window),state:r.state as UsageState,
 usedPercent:num(r.used_percent),resetsAt:text(r.resets_at),
 checkedAt:text(r.checked_at),limitReached:!!r.limit_reached,
 source:text(r.source),updatedAt:String(r.updated_at),
 metricId:text(r.metric_id),label:text(r.label),
 unit:text(r.unit),used:num(r.used),limitValue:num(r.limit_value),remaining:num(r.remaining),
 reason:text(r.reason),retryAt:text(r.retry_at),startsAt:text(r.starts_at)
})
