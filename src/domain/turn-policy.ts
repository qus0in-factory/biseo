import type{AgentInfo,PaneInfo}from'./herdr.js'
export type Target={pane:PaneInfo;agent?:AgentInfo}
export function findTarget(panes:PaneInfo[],agents:AgentInfo[],paneId:string):Target|undefined{
 const pane=panes.find(p=>p.pane_id===paneId)
 if(!pane)return
 return {pane,agent:agents.find(a=>a.pane_id===paneId)}
}
export function targetIssue(t:Target):string|null{
 const a=t.agent,kind=a?.agent??t.pane.agent??null,status=a?.agent_status??t.pane.agent_status
 if(!kind)return 'no_agent_in_pane'
 if(a?.launch_pending===true||status==='working')return 'agent_busy'
 if(status==='blocked')return 'agent_blocked'
 if(status==='unknown'||a?.interactive_ready===false||(status!=='idle'&&status!=='done'))return 'agent_unknown'
 return null
}
export function sameSession(a:PaneInfo,b:PaneInfo){
 return a.terminal_id===b.terminal_id&&(a.agent??null)===(b.agent??null)&&sessionKey(a)===sessionKey(b)
}
function sessionKey(p:PaneInfo):string{
 return p.agent_session?`${p.agent_session.source}:${p.agent_session.value}`:''
}
