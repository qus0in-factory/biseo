import{useOutletContext}from'react-router'
import type{ReactNode}from'react'
import{useWorkspaceController}from'../app/useWorkspaceController'
import{workspaceApi as api}from'../infra/workspaceApi'
import{timelineStream as st}from'../infra/timelineStream'
import{DashboardView}from'./DashboardView'
import type{AppOutletContext}from'./AppContent'
export function WorkspaceSection({on,headerActions}:{on:boolean;headerActions?:ReactNode}){
 const ctx=useOutletContext<AppOutletContext|null>()
 const a=headerActions??ctx?.headerActions
 const{panes,sel,setSel,items,sending,send,online,loadOlder,olderLoaded,panesState,panesRetry,timelineState,retryTimeline}=useWorkspaceController(api,st,on)
 return(
  <DashboardView panes={panes} panesState={panesState} panesRetry={panesRetry} selectedId={sel} onSelect={setSel} timeline={items} timelineState={timelineState} retryTimeline={retryTimeline} sending={sending} onSend={send} online={online} onLoadOlder={loadOlder} olderLoaded={olderLoaded} headerActions={a}/>
 )
}
