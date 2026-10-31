import type{PaneInfo}from'../domain/herdr.js'
import type{TimelineItem}from'../domain/timeline.js'
export function makePane(o:Partial<PaneInfo>={}):PaneInfo{
 return{pane_id:'w:p1',tab_id:'t',workspace_id:'w',terminal_id:'t',agent_status:'idle',agent:'claude',label:'worker',revision:1,...o}
}
export function makeQueueItem(o:Partial<TimelineItem>={}):TimelineItem{
 return{requestId:'q1',workspaceId:'w',paneId:'w:p1',targetName:'worker',agentKind:'claude',promptText:'hi',status:'queued',responseText:null,errorCode:null,createdAt:'2026-01-01T00:00:00Z',seq:1,completedAt:null,...o}
}
