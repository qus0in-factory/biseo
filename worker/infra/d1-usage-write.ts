import type{D1Database}from'@cloudflare/workers-types'
import type{UsageSnapshot}from'./d1-usage-types.js'
const SQL=`INSERT INTO usage_snapshots
 (provider,window,state,used_percent,resets_at,checked_at,limit_reached,source,updated_at,metric_id,label,unit,used,limit_value,remaining,reason,retry_at)
 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export async function upsertUsage(db:D1Database,rows:UsageSnapshot[]){
 const stmts=[db.prepare('DELETE FROM usage_snapshots')]
 for(const r of rows)stmts.push(db.prepare(SQL).bind(
  r.provider,r.window,r.state,r.usedPercent,r.resetsAt,r.checkedAt,r.limitReached?1:0,r.source,r.updatedAt,
  r.metricId??r.window,r.label??r.metricId??r.window,r.unit??'percent',r.used??r.usedPercent,r.limitValue??100,
  r.remaining??(r.usedPercent!==null?Math.max(0,100-r.usedPercent):null),r.reason??null,r.retryAt??null
 ))
 await db.batch(stmts)
}
