import type{WorkspaceInfo}from'../domain/herdr.js'
import {call}from'./herdr-exec.js'
export async function listWorkspaces(){
 const r=await call(['workspace','list'],15000)
 const rows=(r.result?.workspaces??[]) as Array<Record<string,unknown>>
 return rows.map(w=>({
  workspace_id:String(w.workspace_id??w.id??''),
  id:String(w.workspace_id??w.id??''),
  label:typeof w.label==='string'?w.label:null,
  focused:!!w.focused,
  pane_count:typeof w.pane_count==='number'?w.pane_count:undefined,
  number:typeof w.number==='number'?w.number:undefined,
 })) as WorkspaceInfo[]
}