import{closePane,renamePane}from'./herdr-panes.js'
import{createTab,renameTab,getTab}from'./herdr-tabs.js'
import{startAgent,renameAgent}from'./herdr-agent-manage.js'
import{listWorkspaces}from'./herdr-workspaces.js'
export class HerdrManagement{
 listWorkspaces(){return listWorkspaces()}
 getTab(id:string){return getTab(id)}
 createTab(ws:string,label?:string){return createTab(ws,label)}
 closePane(id:string){return closePane(id)}
 renamePane(id:string,label:string){return renamePane(id,label)}
 renameTab(id:string,label:string){return renameTab(id,label)}
 renameAgent(target:string,name:string){return renameAgent(target,name)}
 startAgent(name:string,kind:string,pane:string,args:string[]=[]){return startAgent(name,kind,pane,args)}
}
