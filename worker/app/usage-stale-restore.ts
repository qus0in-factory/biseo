import type{UsageSnapshot}from'../infra/d1-usage-types.js'
import policyJson from'./usage-provider-policy.json'
type Policy={staleReasons?:string[];restoreState?:string}
const policy:Record<string,Policy>=policyJson
export const isStaleReason=(r:UsageSnapshot)=>r.reason==='auth_required'||r.reason==='auth_failed'||r.reason==='agy_auth_expired'||(policy[r.provider]?.staleReasons?.includes(r.reason??'')??false)
export const hasUsageValue=(r:UsageSnapshot)=>r.usedPercent!==null||r.used!==null||r.remaining!==null
export const restoreStaleRow=(r:UsageSnapshot,e:UsageSnapshot):UsageSnapshot=>({
 ...e,state:(policy[r.provider]?.restoreState as UsageSnapshot['state']|undefined)??(r.state!=='unknown'?r.state:e.state),reason:r.reason,
 retryAt:r.retryAt??e.retryAt,updatedAt:r.updatedAt,
 checkedAt:r.checkedAt??e.checkedAt,usedPercent:r.usedPercent??e.usedPercent,
 resetsAt:r.resetsAt??e.resetsAt,used:r.used??e.used,
 remaining:r.remaining??e.remaining,limitValue:r.limitValue??e.limitValue
})
