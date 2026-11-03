import{useState}from'react'
import{RefreshCw}from'lucide-react'
import{SettingsAction}from'./SettingsAction'
import{WorkspacePickerDialog}from'./WorkspacePickerDialog'
import type{WorkspaceSelector}from'./workspaceSelectionLink'
import r from'../resources.json'

export function WorkspaceSwitcher({current,select,switching}:{current:string|null;select?:WorkspaceSelector|null;switching?:boolean}){
 const[open,setOpen]=useState(false)
 const label=current?r.workspaceCurrent.replace('{id}',current):r.workspaceCurrentUnknown
 return<>
  <div className="workspace-switcher">
   <span className="workspace-switcher-label" title={label}>{label}</span>
   <SettingsAction icon={RefreshCw} type="button" busy={switching} aria-haspopup="dialog"
    onClick={()=>setOpen(true)}>{r.workspaceSwitch}</SettingsAction>
  </div>
  <WorkspacePickerDialog open={open} onClose={()=>setOpen(false)} current={current} select={select}/>
 </>
}
