import r from'../resources.json'
import { Check, X, Pencil } from 'lucide-react'
import { SettingsAction } from './SettingsAction'
type P={p:{paneId:string;name:string};busy:boolean;renameId:string|null;renameName:string;setRenameId:(v:string|null)=>void;setRenameName:(v:string)=>void;onRename:(id:string)=>void}
export function PaneManageRenameControls(x:P){
 const p=x.p
 if(x.renameId===p.paneId) return(
  <>
   <input aria-label={r.paneNameLabel} value={x.renameName} onChange={e=>x.setRenameName(e.target.value)} disabled={x.busy}/>
   <SettingsAction icon={Check} onClick={()=>x.onRename(p.paneId)} busy={x.busy}>{r.confirm}</SettingsAction>
   <SettingsAction icon={X} onClick={()=>x.setRenameId(null)} disabled={x.busy}>{r.cancel}</SettingsAction>
  </>
 )
 return <SettingsAction icon={Pencil} onClick={()=>{x.setRenameId(p.paneId);x.setRenameName(p.name)}} disabled={x.busy}>{r.renamePane}</SettingsAction>
}
