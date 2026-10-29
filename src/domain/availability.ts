import type{Availability}from'./timeline.js'
export type RateLimits={reached:string|null;primary:string|null;secondary:string|null;snapshotAt:string|null}
const unknown=(now:Date):Availability=>({state:'unknown',source:null,checkedAt:null,observedAt:now.toISOString(),resetsAt:null,reason:null,window:null})
export function unknownAvailability(now=new Date()){return unknown(now)}
export function isLimited(a:Availability){return a.state==='limited'&&!!a.resetsAt}
export function normalizeAvailability(a:Availability,now=new Date()):Availability{
 if(a.state!=='limited')return a
 return a.resetsAt&&Date.parse(a.resetsAt)>now.getTime()?a:{...unknown(now),source:a.source,checkedAt:a.checkedAt}
}
