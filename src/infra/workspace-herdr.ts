import {WorkspaceAgents} from './workspace-agents.js'
import {readWorkspace} from './workspace-config.js'
import {checkTabWorkspace} from './tab-workspace-check.js'
import {checkPaneWorkspace} from './pane-workspace-check.js'
export class WorkspaceHerdr extends WorkspaceAgents {
 private async check(id:string) {
  await checkPaneWorkspace(this,id)
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
  await checkTabWorkspace(this,id,readWorkspace())
  return super.renameTab(id,label)
 }
}
