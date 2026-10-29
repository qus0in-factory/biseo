import{toSummaries}from'../domain/pane-policy.js'
import{normalizeAvailability,unknownAvailability}from'../domain/availability.js'
import type{AgentInfo,PaneInfo}from'../domain/herdr.js'
import type{AvailabilityPort}from'./ports.js'
export async function availabilitySummaries(panes:PaneInfo[],agents:AgentInfo[],locked:{has(k:string):boolean},av:AvailabilityPort|undefined,now=new Date()){
 const s=toSummaries(panes,agents,locked)
 return Promise.all(s.map(async x=>{
  const agent=agents.find(v=>v.pane_id===x.paneId),p=panes.find(v=>v.pane_id===x.paneId)
  const session=agent?.agent_session??p?.agent_session??undefined
  const v=av?await av.get(session,now).catch(()=>unknownAvailability(now)):unknownAvailability(now)
  const a=normalizeAvailability(v,now)
  return a.state==='limited'?{...x,sendable:false,disabledReason:'provider_rate_limited' as const,availability:a}:{...x,availability:a}
 }))
}
