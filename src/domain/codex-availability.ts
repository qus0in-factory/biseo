import type{RateLimits}from'./availability.js'
import{freshness}from'./availability-stale.js'
import type{Availability,AvailabilityWindow}from'./timeline.js'
export function codexAvailability(r:RateLimits|null,now=new Date(),ttlMs=0):Availability{
 const base={source:'codex',observedAt:now.toISOString()}
 const un=(reason:string):Availability=>({...base,state:'unknown',checkedAt:r?.snapshotAt??null,resetsAt:null,reason,window:null,usedPercent:r?.primaryUsedPercent??r?.secondaryUsedPercent??null})
 if(!r)return un('no_snapshot')
 if(!r.reached){const f=freshness(r.snapshotAt,now,ttlMs);return{...un(f==='fresh'?'no_limit_signal':f),usedPercent:r.primaryUsedPercent??r.secondaryUsedPercent??null}}
 const window:AvailabilityWindow=r.reached==='secondary'?'secondary':'primary',resetsAt=r[window]
 if(!resetsAt||!(Date.parse(resetsAt)>now.getTime()))return{...un('reset_elapsed'),usedPercent:r.primaryUsedPercent??r.secondaryUsedPercent??null}
 const usedPercent=window==='secondary'?r.secondaryUsedPercent:r.primaryUsedPercent
 return{...base,state:'limited',checkedAt:r.snapshotAt,resetsAt,reason:'rate_limit_reached',window,usedPercent}
}
