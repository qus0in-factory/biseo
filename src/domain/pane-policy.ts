import type{AgentInfo,PaneInfo}from'./herdr.js'
import {paneReason}from'./pane-reason.js'
import {paneName}from'./pane-name.js'
export function toSummaries(panes:PaneInfo[],agents:AgentInfo[],locked:{has(k:string):boolean}){
 const by=new Map(agents.map(a=>[a.pane_id,a]))
 return panes.flatMap(p=>{
  const a=by.get(p.pane_id),kind=a?.agent??p.agent??null
  if(!kind)return []
  const status=a?.agent_status??p.agent_status,session=a?.agent_session??p.agent_session??undefined,why=paneReason(status,kind,a,locked.has(p.pane_id),session)
  const agentName=a?.name??a?.display_agent??null,name=paneName(p,a)
  return [{paneId:p.pane_id,tabId:p.tab_id,name,agentKind:kind,agentName,status,sendable:why===null,disabledReason:why,blockedReason:null,revision:p.revision}]
 })
}
