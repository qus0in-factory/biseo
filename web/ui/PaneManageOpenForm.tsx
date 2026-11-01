import r from'../resources.json'
import templates from '../../config/pane-templates.json'
import { Plus } from 'lucide-react'
import { SettingsAction } from './SettingsAction'
type P={template:string;name:string;busy:boolean;setTemplate:(v:string)=>void;setName:(v:string)=>void;onOpen:()=>void}
export function PaneManageOpenForm(p:P){
 return(
  <div className="grid min-w-0 gap-2">
   <label>{r.paneTemplateLabel}
    <select value={p.template} onChange={e=>p.setTemplate(e.target.value)} disabled={p.busy}>
     {templates.map(t=><option key={t.id} value={t.id}>{t.id}</option>)}
    </select>
   </label>
   <label>{r.paneNameLabel}
    <input value={p.name} onChange={e=>p.setName(e.target.value)} disabled={p.busy}/>
   </label>
   <SettingsAction icon={Plus} onClick={p.onOpen} busy={p.busy}>{r.openPane}</SettingsAction>
  </div>
 )
}
