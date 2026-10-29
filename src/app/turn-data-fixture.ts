import type{AgentInfo,PaneInfo}from'../domain/herdr.js'
import type{CaptureReader}from'./ports.js'
export const pane:PaneInfo={pane_id:'w:p1',tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:'idle',agent:'claude',label:'opus',agent_session:{source:'herdr:claude',agent:'claude',kind:'id',value:'s1'},cwd:'/tmp',revision:1}
export const agent:AgentInfo={pane_id:'w:p1',terminal_id:'term',agent_status:'idle',agent:'claude',name:'opus',agent_session:{source:'herdr:claude',agent:'claude',kind:'id',value:'s1'},revision:1}
export const reader:CaptureReader={read:async()=> 'answer'}
export const input={requestId:'r1',workspaceId:'w',paneId:'w:p1',text:'hi'}
