import type{PanesPayload}from'../app/timeline-ports.js'
import type{WorkspacesPayload}from'../app/workspaces-payload.js'
import type{UpstreamEnv}from'./herdr-upstream-config.js'
import{callUpstreamJson as call}from'./herdr-upstream-http.js'
export function workspacesUpstream(env:UpstreamEnv,id:string){
 return{
  listPanes:(ws:string)=>call<PanesPayload>(env,`/herdr/workspaces/${encodeURIComponent(ws)}/panes`,'GET',undefined,id),
  listWorkspaces:()=>call<WorkspacesPayload>(env,'/herdr/workspaces','GET',undefined,id),
 }
}
