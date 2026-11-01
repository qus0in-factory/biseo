import type{PaneSummary}from'../domain/timeline'
import type{UsageProvider}from'../domain/usage'
import{PaneManageRenameControls}from'./PaneManageRenameControls'
import{PaneManageCloseControls}from'./PaneManageCloseControls'
import{PaneManageSummary}from'./PaneManageSummary'
type P={p:PaneSummary;providers:UsageProvider[];busy:boolean;confirmId:string|null;renameId:string|null;renameName:string;setConfirmId:(v:string|null)=>void;setRenameId:(v:string|null)=>void;setRenameName:(v:string)=>void;onClose:(id:string)=>void;onRename:(id:string)=>void}
export function PaneManagePaneItem(x:P){
 return(
  <li key={x.p.paneId}>
   <div className="pane-manage-head">
    <span className="pane-manage-name">{x.p.name}</span>
    <div className="pane-actions">
     <PaneManageRenameControls {...x}/>
     <PaneManageCloseControls {...x}/>
    </div>
   </div>
   <PaneManageSummary pane={x.p} providers={x.providers}/>
  </li>
 )
}
