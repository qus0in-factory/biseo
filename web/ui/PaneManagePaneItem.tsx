import{PaneManageRenameControls}from'./PaneManageRenameControls'
import{PaneManageCloseControls}from'./PaneManageCloseControls'
type P={p:{paneId:string;name:string};busy:boolean;confirmId:string|null;renameId:string|null;renameName:string;setConfirmId:(v:string|null)=>void;setRenameId:(v:string|null)=>void;setRenameName:(v:string)=>void;onClose:(id:string)=>void;onRename:(id:string)=>void}
export function PaneManagePaneItem(x:P){
 return(
  <li key={x.p.paneId}>
   <span>{x.p.name}</span>
   <PaneManageRenameControls p={x.p} busy={x.busy} renameId={x.renameId} renameName={x.renameName} setRenameId={x.setRenameId} setRenameName={x.setRenameName} onRename={x.onRename}/>
   <PaneManageCloseControls p={x.p} busy={x.busy} confirmId={x.confirmId} setConfirmId={x.setConfirmId} onClose={x.onClose}/>
  </li>
 )
}
