import type{D1Database}from'@cloudflare/workers-types'
import type{RecentResponse}from'../../shared/domain/recent-response.js'
import{insertRecent}from'../infra/recent-insert.js'
export function importRecent(db:D1Database,recent:RecentResponse,workspaceId:string,paneId:string,ownerSubject:string){
 const at=new Date().toISOString()
 return insertRecent(db,{
  requestId:`pull-${recent.key}`,workspaceId,paneId,ownerSubject,
  targetName:recent.targetName,agentKind:recent.agentKind,
  promptText:recent.promptText,responseText:recent.responseText,
  status:'completed',errorCode:null,createdAt:at,updatedAt:at,completedAt:at,
 })
}
