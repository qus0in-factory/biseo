import type{AgentInfo,PaneInfo}from'./herdr.js'
import {paneReason}from'./pane-reason.js'
export function toSummaries(panes:PaneInfo[],agents:AgentInfo[],locked:{has(k:string):boolean}){
 const by=new Map(agents.map(a=>[a.pane_id,a]))
 return panes.map(p=>{
  const a=by.get(p.pane_id),kind=a?.agent??p.agent??null,status=a?.agent_status??p.agent_status,session=a?.agent_session??p.agent_session??undefined,why=paneReason(status,kind,a,locked.has(p.pane_id),session)
  return {paneId:p.pane_id,tabId:p.tab_id,name:p.label??p.title??p.terminal_title_stripped??p.pane_id,agentKind:kind,agentName:a?.name??a?.display_agent??null,status,sendable:why===null,disabledReason:why,revision:p.revision}
 })
}
