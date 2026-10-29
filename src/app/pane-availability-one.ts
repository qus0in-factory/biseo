import{lookupAvailability}from'./availability-lookup.js'
import{paneBlocked}from'./pane-blocked.js'
import{suspectedLimit}from'./pane-suspected.js'
import type{LimitScreen}from'./limit-screen.js'
import type{AgentInfo,PaneInfo}from'../domain/herdr.js'
import type{AvailabilityPort}from'./ports.js'
import type{PaneSummary}from'../domain/timeline.js'
type PaneBase=Omit<PaneSummary,'availability'>
export async function availabilityOne(x:PaneBase,panes:PaneInfo[],agents:AgentInfo[],av:AvailabilityPort|undefined,now:Date,limits?:LimitScreen){
 const agent=agents.find(v=>v.pane_id===x.paneId),p=panes.find(v=>v.pane_id===x.paneId)
 const session=agent?.agent_session??p?.agent_session??undefined
 const a=await lookupAvailability(av,session,now)
 const suspected=await suspectedLimit(x,a,limits)
 const blockedReason=paneBlocked(x,a,suspected)
 const base={...x,blockedReason,availability:a}
 return a.state==='limited'?{...base,sendable:false,disabledReason:'provider_rate_limited'as const}:base
}
