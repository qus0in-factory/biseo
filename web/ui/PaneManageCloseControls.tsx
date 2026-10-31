import r from'../resources.json'
import { Check, X, Trash2 } from 'lucide-react'
import { SettingsAction } from './SettingsAction'
type P={p:{paneId:string;name:string};busy:boolean;confirmId:string|null;setConfirmId:(v:string|null)=>void;onClose:(id:string)=>void}
export function PaneManageCloseControls(x:P){
 const p=x.p
 if(x.confirmId===p.paneId) return(
  <>
   <span>{r.confirmClose}</span>
   <SettingsAction icon={Check} danger onClick={()=>x.onClose(p.paneId)} busy={x.busy}>{r.confirm}</SettingsAction>
   <SettingsAction icon={X} onClick={()=>x.setConfirmId(null)} disabled={x.busy}>{r.cancel}</SettingsAction>
  </>
 )
 return <SettingsAction icon={Trash2} danger onClick={()=>x.setConfirmId(p.paneId)} disabled={x.busy}>{r.closePane}</SettingsAction>
}
