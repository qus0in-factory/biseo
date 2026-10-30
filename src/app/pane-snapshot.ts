import{availabilitySummaries}from'./pane-availability.js'
import type{AvailabilityPort,HerdrPort}from'./ports.js'
import type{LimitScreen}from'./limit-screen.js'
import type{PaneLocks}from'./pane-locks.js'
export async function paneSnapshot(h:HerdrPort,l:PaneLocks,ws:string,av?:AvailabilityPort,limits?:LimitScreen,inputs?:LimitScreen){
 const [panes,agents]=await Promise.all([h.listPanes(ws),h.listAgents()])
 return {workspaceId:ws,panes:await availabilitySummaries(panes,agents,l,av,new Date(),limits,inputs)}
}
