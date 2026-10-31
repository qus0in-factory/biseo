import type{AgentInfo,PaneInfo,WorkspaceInfo}from'../domain/herdr.js'
import {call}from'./herdr-exec.js'
import {getAgent,getPane,listAgents,listPanes,closePane,renamePane}from'./herdr-panes.js'
import {createTab,renameTab,getTab}from'./herdr-tabs.js'
import {startAgent,renameAgent}from'./herdr-agent-manage.js'
import {listWorkspaces}from'./herdr-workspaces.js'
import {readRecent}from'./herdr-read.js'
import {sendKeys}from'./herdr-send.js'
import {promptArgs}from'./herdr-prompt-args.js'
export class HerdrCli{
 listPanes(ws:string):Promise<PaneInfo[]>{return listPanes(ws)}
 listAgents():Promise<AgentInfo[]>{return listAgents()}
 listWorkspaces():Promise<WorkspaceInfo[]>{return listWorkspaces()}
 getPane(id:string){return getPane(id)}
 getTab(id:string){return getTab(id)}
 getAgent(id:string){return getAgent(id)}
 async prompt(id:string,text:string,timeoutMs:number,acceptanceMs?:number){
  await call(promptArgs(id,text,acceptanceMs),Math.min(timeoutMs+(acceptanceMs??0),60000))
 }
 sendKeys(id:string,keys:string){return sendKeys(id,keys)}
 readRecent(id:string,lines:number){return readRecent(id,lines)}
 createTab(ws:string,label?:string){return createTab(ws,label)}
 closePane(id:string){return closePane(id)}
 renamePane(id:string,label:string){return renamePane(id,label)}
 renameTab(id:string,label:string){return renameTab(id,label)}
 renameAgent(target:string,name:string){return renameAgent(target,name)}
 startAgent(name:string,kind:string,paneId:string,args:string[]=[]){return startAgent(name,kind,paneId,args)}
}