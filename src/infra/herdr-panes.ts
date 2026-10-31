import type{AgentInfo,PaneInfo,WorkspaceInfo}from'../domain/herdr.js'
import {call,notFound}from'./herdr-exec.js'
import {withCodex,withCodexAll}from'./herdr-codex.js'
export async function listPanes(ws:string){const r=await call(['pane','list','--workspace',ws],15000);return withCodexAll((r.result?.panes??[]) as PaneInfo[])}
export async function listAgents(){const r=await call(['agent','list'],15000);return withCodexAll((r.result?.agents??[]) as AgentInfo[])}
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
export async function getPane(id:string){try{const r=await call(['pane','get',id],15000);return withCodex(r.result?.pane as PaneInfo|undefined)}catch(e){if(notFound(e))return;throw e}}
export async function getAgent(id:string){try{const r=await call(['agent','get',id],15000);return withCodex(r.result?.agent as AgentInfo|undefined)}catch(e){if(notFound(e))return;throw e}}
