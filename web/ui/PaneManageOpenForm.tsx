import r from'../resources.json'
type P={template:string;name:string;busy:boolean;setTemplate:(v:string)=>void;setName:(v:string)=>void;onOpen:()=>void}
export function PaneManageOpenForm(p:P){
 return(
  <div className="grid min-w-0 gap-2">
   <label>{r.paneTemplateLabel}
    <select value={p.template} onChange={e=>p.setTemplate(e.target.value)} disabled={p.busy}>
     <option value="opencode">opencode</option>
     <option value="claude">claude</option>
     <option value="codex">codex</option>
    </select>
   </label>
   <label>{r.paneNameLabel}
    <input value={p.name} onChange={e=>p.setName(e.target.value)} disabled={p.busy}/>
   </label>
   <button type="button" onClick={()=>void p.onOpen()} disabled={p.busy}>{r.openPane}</button>
  </div>
 )
}
