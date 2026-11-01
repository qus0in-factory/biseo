import{usePaneManageState}from'../app/paneManageState'
import{createPaneManageActions}from'../app/paneManageActions'
import { Plus } from 'lucide-react'
import { SettingsAction } from './SettingsAction'
import { PaneManageList } from './PaneManageList'
import { AsyncList } from './AsyncList'
import { ListSkeleton } from './ListSkeleton'
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
   <AsyncList state={s.state} skeleton={<div className="pane-manage-skeleton"><ListSkeleton/></div>} empty={<p>{r.paneManageEmpty}</p>}
    errorText={r.panesError} onRetry={()=>void s.load().catch(()=>{})}>
    {()=> <PaneManageList s={s} a={a}/>}
   </AsyncList>
  </section>
 )
}
