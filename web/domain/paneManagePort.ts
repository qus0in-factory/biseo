import type{AppConfig,WorkspaceSummary}from'./portTypes'
export interface PaneManagePort{
 listWorkspaces?():Promise<WorkspaceSummary[]>
 selectWorkspace?(workspaceId:string):Promise<AppConfig>
 openPane?(input:{templateId?:string;name?:string}):Promise<{paneId:string}>
 closePane?(paneId:string):Promise<void>
 renamePane?(paneId:string,name:string):Promise<void>
}
