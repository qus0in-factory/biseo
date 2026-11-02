import type{D1Database}from'@cloudflare/workers-types'
import type{UsageSnapshot}from'./d1-usage-types.js'
import{listUsage}from'./d1-usage-read.js'
import{mergeUsageStale}from'../app/usage-merge-stale.js'
import{usageParams}from'./d1-usage-params.js'
const SQL=`INSERT INTO usage_snapshots
 (provider,window,state,used_percent,resets_at,checked_at,limit_reached,source,updated_at,metric_id,label,unit,used,limit_value,remaining,reason,retry_at,starts_at)
 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export async function upsertUsage(db:D1Database,rows:UsageSnapshot[]){
 const existing=await listUsage(db)
 const merged=mergeUsageStale(rows,existing)
 const stmts=[db.prepare('DELETE FROM usage_snapshots')]
 for(const r of merged)stmts.push(db.prepare(SQL).bind(...usageParams(r)))
 await db.batch(stmts)
 return merged
}
