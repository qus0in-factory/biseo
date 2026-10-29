import{toSummaries}from'../domain/pane-policy.js'
import{availabilityOne}from'./pane-availability-one.js'
import{demoteStale}from'../domain/availability-stale.js'
import type{LimitScreen}from'./limit-screen.js'
import type{AgentInfo,PaneInfo}from'../domain/herdr.js'
import type{AvailabilityPort}from'./ports.js'
export async function availabilitySummaries(panes:PaneInfo[],agents:AgentInfo[],locked:{has(k:string):boolean},av:AvailabilityPort|undefined,now=new Date(),limits?:LimitScreen){
 return Promise.all(toSummaries(panes,agents,locked).map(async x=>{
  const r=await availabilityOne(x,panes,agents,av,now,limits)
  const a=demoteStale(r.availability,now,av?.ttlMs??0)
  return{...r,availability:a}
 }))
}
