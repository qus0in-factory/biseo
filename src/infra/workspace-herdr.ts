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
}
