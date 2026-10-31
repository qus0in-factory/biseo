import{usePaneManageState}from'../app/paneManageState'
import{createPaneManageActions}from'../app/paneManageActions'
import{PaneManageOpenForm}from'./PaneManageOpenForm'
import { PaneManageList } from './PaneManageList'
import r from'../resources.json'
type P={workspaceId?:string}
export function PaneManageSection({workspaceId}:P){
 const s=usePaneManageState(workspaceId)
 const a=createPaneManageActions(s)
 return(
  <section>
   <h2>{r.paneManageTitle}</h2>
   <PaneManageOpenForm template={s.template} name={s.name} busy={s.busy} setTemplate={s.setTemplate} setName={s.setName} onOpen={a.open}/>
   <p role="status">{s.msg}</p>
   {s.panes.length===0?<p>{r.paneManageEmpty}</p>:(
    <PaneManageList s={s} a={a}/>
   )}
  </section>
 )
}
