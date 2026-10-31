import{useOutletContext}from'react-router'
import type{ReactNode}from'react'
import{useWorkspaceController}from'../app/useWorkspaceController'
import{workspaceApi as api}from'../infra/workspaceApi'
import{timelineStream as st}from'../infra/timelineStream'
import{WorkspaceDashboard}from'./WorkspaceDashboard'
import{WorkspacePicker}from'./WorkspacePicker'
import type{AppOutletContext}from'./AppContent'
export function WorkspaceSection({on,headerActions}:{on:boolean;headerActions?:ReactNode}){
 const ctx=useOutletContext<AppOutletContext|null>()
 const c=useWorkspaceController(api,st,on)
 return(
  <>
   <WorkspacePicker api={api} />
   <WorkspaceDashboard c={c} headerActions={headerActions??ctx?.headerActions}/>
  </>
 )
}
