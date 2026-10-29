import type{Availability}from'./timeline.js'
export function ageMs(at:string|null,now:Date):number|null{
 if(!at)return null
 const t=Date.parse(at)
 return Number.isFinite(t)?now.getTime()-t:null
}
export function isStale(at:string|null,now:Date,ttlMs:number):boolean{
 if(ttlMs<=0)return false
 const age=ageMs(at,now)
 return age===null||age>ttlMs
}
export function freshness(at:string|null,now:Date,ttlMs:number):'fresh'|'stale_snapshot'|'no_snapshot_time'{
 const age=ageMs(at,now)
 if(age===null)return 'no_snapshot_time'
 return ttlMs>0&&age>ttlMs?'stale_snapshot':'fresh'
}
export function demoteStale(a:Availability,now:Date,ttlMs:number):Availability{
 if(a.state!=='available')return a
 return isStale(a.checkedAt,now,ttlMs)?{...a,state:'unknown',resetsAt:null,reason:'stale_availability',window:null}:a
}
