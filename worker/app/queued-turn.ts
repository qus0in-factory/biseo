import type{SubmitMessageInput}from'../domain/message-input.js'
import type{TurnRecord}from'../domain/timeline-record.js'
export const queuedRecord=(i:SubmitMessageInput,owner:string,ws:string,now:string,terminalId:string|null=null):TurnRecord=>({
 requestId:i.requestId,workspaceId:ws,ownerSubject:owner,paneId:i.paneId,targetName:i.paneId,
 agentKind:null,promptText:i.text,status:'queued',responseText:null,errorCode:null,
 createdAt:now,updatedAt:now,completedAt:null,terminalId,
})
