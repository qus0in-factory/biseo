import type{TurnStatus}from'./timeline-types.js'
export type TurnRecord={
 requestId:string;workspaceId:string;ownerSubject:string;paneId:string;
 targetName:string;agentKind:string|null;promptText:string;status:TurnStatus;
 responseText:string|null;errorCode:string|null;createdAt:string;
 updatedAt:string;completedAt:string|null;seq?:number
}
export type TurnScope={workspaceId:string;ownerSubject:string}
export const isPending=(s:TurnStatus)=>s==='queued'||s==='working'||s==='timeout'
export const isTerminal=(s:TurnStatus)=>!isPending(s)
