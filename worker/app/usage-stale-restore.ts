import type{UsageSnapshot}from'../infra/d1-usage-types.js'
export const isStaleReason=(r:UsageSnapshot)=>r.reason==='auth_required'||r.reason==='auth_failed'||r.reason==='agy_auth_expired'||(r.provider==='grok'&&(r.reason==='temporarily_unavailable'||r.reason==='schema_error'))
export const hasUsageValue=(r:UsageSnapshot)=>r.usedPercent!==null||r.used!==null||r.remaining!==null
export const restoreStaleRow=(r:UsageSnapshot,e:UsageSnapshot):UsageSnapshot=>({
 ...e,state:r.provider==='grok'?'unknown':r.state!=='unknown'?r.state:e.state,reason:r.reason,
 retryAt:r.retryAt??e.retryAt,updatedAt:r.updatedAt,
 checkedAt:r.checkedAt??e.checkedAt,usedPercent:r.usedPercent??e.usedPercent,
 resetsAt:r.resetsAt??e.resetsAt,used:r.used??e.used,
 remaining:r.remaining??e.remaining,limitValue:r.limitValue??e.limitValue
})
