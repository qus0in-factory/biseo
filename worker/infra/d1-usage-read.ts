import type{D1Database}from'@cloudflare/workers-types'
import type{UsageSnapshot,UsageState}from'./d1-usage-types.js'
export async function listUsage(db:D1Database){
 const x=await db.prepare('SELECT provider,window,state,used_percent,resets_at,checked_at,limit_reached,source,updated_at FROM usage_snapshots ORDER BY provider,window').all<Record<string,unknown>>()
 return (x.results??[]).map(r=>({provider:String(r.provider),window:String(r.window),state:r.state as UsageState,usedPercent:typeof r.used_percent==='number'?r.used_percent:null,resetsAt:(r.resets_at as string|null)??null,checkedAt:(r.checked_at as string|null)??null,limitReached:!!r.limit_reached,source:(r.source as string|null)??null,updatedAt:String(r.updated_at)}) as UsageSnapshot)
}
