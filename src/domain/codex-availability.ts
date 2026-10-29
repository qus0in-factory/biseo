import type{RateLimits}from'./availability.js'
import type{Availability,AvailabilityWindow}from'./timeline.js'
export function codexAvailability(r:RateLimits|null,now=new Date()):Availability{
 const base={source:'codex',checkedAt:now.toISOString()}
 if(!r)return{...base,state:'unknown',resetsAt:null,reason:null,window:null}
 if(!r.reached)return{...base,state:'available',resetsAt:null,reason:null,window:null}
 const window:AvailabilityWindow=r.reached.includes('secondary')?'secondary':'primary',resetsAt=r[window]
 if(!resetsAt||!(Date.parse(resetsAt)>now.getTime()))return{...base,state:'unknown',resetsAt:null,reason:null,window:null}
 return{...base,state:'limited',resetsAt,reason:'rate_limit_reached',window}
}
