import {toSummaries}from'../domain/pane-policy.js'
import type{HerdrPort}from'./ports.js'
import type{PaneLocks}from'./pane-locks.js'
export async function paneSnapshot(h:HerdrPort,l:PaneLocks,ws:string){
 const [panes,agents]=await Promise.all([h.listPanes(ws),h.listAgents()])
 return {workspaceId:ws,panes:toSummaries(panes,agents,l)}
}
