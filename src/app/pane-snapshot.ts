import{availabilitySummaries}from'./pane-availability.js'
import{paneModelCache}from'./pane-model-cache.js'
import type{AvailabilityPort,HerdrPort}from'./ports.js'
import type{LimitScreen}from'./limit-screen.js'
import type{PaneLocks}from'./pane-locks.js'
export async function paneSnapshot(h:HerdrPort,l:PaneLocks,ws:string,av?:AvailabilityPort,limits?:LimitScreen,inputs?:LimitScreen){
 const [panes,agents]=await Promise.all([h.listPanes(ws),h.listAgents()])
 const s=await availabilitySummaries(panes,agents,l,av,new Date(),limits,inputs)
 const m=await paneModelCache(h,s)
 return {workspaceId:ws,panes:s.map(x=>{
  const v=m[x.paneId]
  return v?{...x,modelId:v.modelId,modelProvider:v.provider}:x
 })}
}
