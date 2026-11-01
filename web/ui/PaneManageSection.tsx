import{usePaneManageState}from'../app/paneManageState'
import{createPaneManageActions}from'../app/paneManageActions'
import { Plus } from 'lucide-react'
import { SettingsAction } from './SettingsAction'
import { PaneManageList } from './PaneManageList'
import r from'../resources.json'
type P={workspaceId?:string;onAdd:()=>void}
export function PaneManageSection({workspaceId,onAdd}:P){
 const s=usePaneManageState(workspaceId)
 const a=createPaneManageActions(s)
 return(
  <section>
   <h2>{r.paneManageTitle}</h2>
   <SettingsAction icon={Plus} onClick={onAdd}>{r.addPane}</SettingsAction>
   <p role="status">{s.msg}</p>
   {s.panes.length===0?<p>{r.paneManageEmpty}</p>:(
    <PaneManageList s={s} a={a}/>
   )}
  </section>
 )
}
