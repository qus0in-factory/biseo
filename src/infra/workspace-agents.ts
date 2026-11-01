import{HerdrCli}from'./herdr-cli.js'
import{checkPaneWorkspace}from'./pane-workspace-check.js'
export class WorkspaceAgents extends HerdrCli{
 override async renameAgent(target:string,name:string){
  await checkPaneWorkspace(this,target)
  return super.renameAgent(target,name)
 }
 override async startAgent(name:string,kind:string,paneId:string,args:string[]=[]){
  await checkPaneWorkspace(this,paneId)
  return super.startAgent(name,kind,paneId,args)
 }
}
