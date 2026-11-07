import type{UsageSnapshot}from'../infra/d1-usage-types.js'
import policyJson from'./usage-provider-policy.json'
import{parseProviderPolicy,lookupPolicy}from'./usage-provider-policy.js'
const map=parseProviderPolicy(policyJson)
const policy=(p:string)=>lookupPolicy(map,p)
const AUTH=['auth_required','auth_failed','agy_auth_expired']
export const isStaleReason=(r:UsageSnapshot)=>AUTH.includes(r.reason??'')||(policy(r.provider)?.staleReasons.includes(r.reason??'')??false)
export const hasUsageValue=(r:UsageSnapshot)=>r.usedPercent!==null||r.used!==null||r.remaining!==null
export const restoreStaleRow=(r:UsageSnapshot,e:UsageSnapshot):UsageSnapshot=>({
 ...e,state:policy(r.provider)?.restoreState??(r.state!=='unknown'?r.state:e.state),reason:r.reason,
 retryAt:r.retryAt??e.retryAt,updatedAt:r.updatedAt,checkedAt:r.checkedAt??e.checkedAt,
 usedPercent:r.usedPercent??e.usedPercent,resetsAt:r.resetsAt??e.resetsAt,used:r.used??e.used,
 remaining:r.remaining??e.remaining,limitValue:r.limitValue??e.limitValue
})
