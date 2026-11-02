import { SettingsAction } from './SettingsAction'
import { Check } from 'lucide-react'
import type { WorkspaceSummary } from '../domain/ports'
import r from '../resources.json'
type P={workspace:WorkspaceSummary;selected:boolean;loading:boolean;onSelect:(id:string)=>void}
export function WorkspacePickerItem({ workspace: w, selected, loading, onSelect }: P) {
 const id=w.workspaceId??w.id??'', name=w.label??id
 const meta=[id,w.focused?r.workspaceFocused:null,typeof w.paneCount==='number'?`${r.panesTitle}: ${w.paneCount}`:null].filter(Boolean) as string[]
 return <li className={`workspace-item${selected?' bg-muted':''}`} aria-current={selected?'true':undefined}>
  <div className="workspace-head">
   <span className="workspace-name" title={name}>{name}</span>
   {selected?null:<SettingsAction icon={Check} type="button" onClick={()=>void onSelect(id)} busy={loading}>{r.workspaceSelect}</SettingsAction>}
  </div>
  <div className="workspace-meta">{meta.map((m,i)=><span key={i}>{m}</span>)}</div>
 </li>
}
