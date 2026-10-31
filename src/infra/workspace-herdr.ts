import {HerdrCli} from './herdr-cli.js'
import {readWorkspace} from './workspace-config.js'
export class WorkspaceHerdr extends HerdrCli {
 private async check(id:string) {
  const ws=readWorkspace(),pane=await this.getPane(id)
  if(!ws||ws!==readWorkspace()||pane?.workspace_id!==ws)
   throw Object.assign(new Error('workspace_not_allowed'),{code:'workspace_not_allowed'})
 }
 override async prompt(id:string,text:string,ms:number,accept?:number) {
  await this.check(id)
  return super.prompt(id,text,ms,accept)
 }
 override async sendKeys(id:string,keys:string) {
  await this.check(id)
  return super.sendKeys(id,keys)
 }
 override async closePane(id:string) {
  await this.check(id)
  return super.closePane(id)
 }
 override async renamePane(id:string,label:string) {
  await this.check(id)
  return super.renamePane(id,label)
 }
 override async renameTab(id:string,label:string) {
  const ws=readWorkspace()
  if(!ws)throw Object.assign(new Error('workspace_not_allowed'),{code:'workspace_not_allowed'})
  if(typeof this.getTab==='function'){
   const tab=await this.getTab(id).catch(()=>undefined)
   if(tab?.workspace_id!==ws)throw Object.assign(new Error('workspace_not_allowed'),{code:'workspace_not_allowed'})
  }else{
   const panes=await this.listPanes(ws).catch(()=>[])
   if(!panes.some(p=>p.tab_id===id))throw Object.assign(new Error('workspace_not_allowed'),{code:'workspace_not_allowed'})
  }
  return super.renameTab(id,label)
 }
 override async renameAgent(target:string,name:string) {
  await this.check(target)
  return super.renameAgent(target,name)
 }
 override async startAgent(name:string,kind:string,paneId:string,args:string[]=[]){
  await this.check(paneId)
  return super.startAgent(name,kind,paneId,args)
 }
}
