import type{TabInfo,WorkspaceInfo}from'../domain/herdr.js'
export interface PaneManagePort{
 listWorkspaces?():Promise<WorkspaceInfo[]>
 getTab?(id:string):Promise<TabInfo|undefined>
 createTab?(workspaceId:string,label?:string):Promise<{tabId:string;paneId:string}>
 closePane?(id:string):Promise<void>
 renamePane?(id:string,label:string):Promise<void>
 renameTab?(id:string,label:string):Promise<void>
 renameAgent?(target:string,name:string):Promise<void>
 startAgent?(name:string,kind:string,paneId:string,args?:string[]):Promise<void>
}
