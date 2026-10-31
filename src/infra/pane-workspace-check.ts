import type{HerdrPort}from'../app/ports.js'
import{readWorkspace}from'./workspace-config.js'
export async function checkPaneWorkspace(h:HerdrPort,id:string){
 const ws=readWorkspace(),pane=await h.getPane(id)
 if(!ws||ws!==readWorkspace()||pane?.workspace_id!==ws)
  throw Object.assign(new Error('workspace_not_allowed'),{code:'workspace_not_allowed'})
}
