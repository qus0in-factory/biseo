import{usePaneManageState}from'../app/paneManageState'
import{createPaneManageActions}from'../app/paneManageActions'
import{PaneManageOpenForm}from'./PaneManageOpenForm'
import{PaneManagePaneItem}from'./PaneManagePaneItem'
import r from'../resources.json'
type P={workspaceId?:string}
export function PaneManageSection({workspaceId}:P){
 const s=usePaneManageState(workspaceId)
 const a=createPaneManageActions(s)
 return(
  <section>
   <h2>{r.paneManageTitle}</h2>
   <PaneManageOpenForm template={s.template} name={s.name} busy={s.busy} setTemplate={s.setTemplate} setName={s.setName} onOpen={a.open}/>
   {s.msg&&<p>{s.msg}</p>}
   {s.panes.length===0?<p>{r.paneManageEmpty}</p>:(
    <ul>
     {s.panes.map(p=>(
      <PaneManagePaneItem key={p.paneId} p={p} busy={s.busy} confirmId={s.confirmId} renameId={s.renameId} renameName={s.renameName} setConfirmId={s.setConfirmId} setRenameId={s.setRenameId} setRenameName={s.setRenameName} onClose={a.close} onRename={a.rename}/>
     ))}
    </ul>
   )}
  </section>
 )
}
