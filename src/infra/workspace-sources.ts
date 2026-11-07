import{resolve}from'node:path'
import{readWorkspace}from'./workspace-config.js'
import{readSelectedWorkspace}from'./workspace-selection.js'
import{listWorkspaces}from'./herdr-workspaces.js'
export type WorkspaceSource=[string,()=>unknown|Promise<unknown>]
export function workspaceSources():WorkspaceSource[]{
 return[
  ['ALLOWED_WORKSPACE_ID',()=>process.env.ALLOWED_WORKSPACE_ID],
  ['runtime.json',()=>readWorkspace(resolve(process.cwd(),'config/runtime.json'),true)],
  ['workspace-selection.json',()=>readSelectedWorkspace()],
  ['HERDR_WORKSPACE_ID',()=>process.env.HERDR_WORKSPACE_ID],
  ['herdr workspace list',async()=> (await listWorkspaces()).find(w=>w.focused)?.workspace_id],
 ]
}
