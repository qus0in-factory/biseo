import{useEffect}from'react'
import type{ReactNode}from'react'
import{useOutletContext}from'react-router'
import{useWorkspaceController}from'../app/useWorkspaceController'
import{workspaceApi as api}from'../infra/workspaceApi'
import{timelineStream as st}from'../infra/timelineStream'
import{WorkspaceDashboard}from'./WorkspaceDashboard'
import{linkWorkspaceSelector}from'./workspaceSelectionLink'
import type{AppOutletContext}from'./AppContent'
export function WorkspaceSection({on,headerActions}:{on:boolean;headerActions?:ReactNode}){
 const ctx=useOutletContext<AppOutletContext|null>()
 const c=useWorkspaceController(api,st,on)
 useEffect(()=>linkWorkspaceSelector(c.selectWorkspace),[c.selectWorkspace])
 return(
  <>
   <WorkspaceDashboard c={c} headerActions={headerActions??ctx?.headerActions}/>
  </>
 )
}
