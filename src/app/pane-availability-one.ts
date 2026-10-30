import{lookupAvailability}from'./availability-lookup.js'
import{paneBlocked}from'./pane-blocked.js'
import{suspectedLimit,suspectedInput}from'./pane-suspected.js'
import type{AgentInfo,PaneInfo}from'../domain/herdr.js'
import type{AvailabilityPort}from'./ports.js'
export async function availabilityOne(x:any,panes:PaneInfo[],agents:AgentInfo[],av:AvailabilityPort|undefined,now:Date,limits?:any,inputs?:any){
 const agent=agents.find((v:any)=>v.pane_id===x.paneId),p=panes.find((v:any)=>v.pane_id===x.paneId)
 const session=agent?.agent_session??p?.agent_session??undefined
 const a=await lookupAvailability(av,session,now)
 const lr=await suspectedLimit(x,a,limits),ir=await suspectedInput(x,a,inputs)
 const br=paneBlocked(x,a,lr,ir)
 const base={...x,blockedReason:br,usageLimitSuspected:lr,availability:a}
 return a.state==='limited'?{...base,sendable:false,disabledReason:'provider_rate_limited'as const}:base
}
