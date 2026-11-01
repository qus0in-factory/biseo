import type{ReactNode}from'react'
import type{useWorkspaceController}from'../app/useWorkspaceController'
import{DashboardView}from'./DashboardView'
type Controller=ReturnType<typeof useWorkspaceController>
export function WorkspaceDashboard({c,headerActions}:{c:Controller;headerActions?:ReactNode}){
 return <DashboardView panes={c.panes} panesState={c.panesState} panesRetry={c.panesRetry}
  selectedId={c.sel} onSelect={c.setSel} timeline={c.items} timelineState={c.timelineState}
  retryTimeline={c.retryTimeline} sending={c.sending} onSend={c.send} online={c.online}
  onLoadOlder={c.loadOlder} olderLoaded={c.olderLoaded} headerActions={headerActions}/>
}
