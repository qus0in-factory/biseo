import type{SubmitMessageInput}from'../domain/message-input.js'
import type{TimelineItem}from'../domain/timeline-types.js'
import type{WorkspacesPayload}from'./workspaces-payload.js'
import type{UpstreamResult,PanesPayload}from'./upstream-result.js'
export type{UpstreamStatus,UpstreamResult,PanesPayload}from'./upstream-result.js'
export interface HerdrUpstreamPort{
 listPanes(workspaceId:string):Promise<UpstreamResult<PanesPayload>>
 listWorkspaces():Promise<UpstreamResult<WorkspacesPayload>>
 submitTurn(input:SubmitMessageInput):Promise<UpstreamResult<Record<string,unknown>>>
 getTurn(requestId:string):Promise<UpstreamResult<TimelineItem>>
 cancelTurn(requestId:string):Promise<UpstreamResult<Record<string,unknown>>>
 interruptPane(paneId:string,key:string):Promise<UpstreamResult<Record<string,unknown>>>
 openEventStream(workspaceId:string,lastEventId?:string|null,signal?:AbortSignal):Promise<Response|{status:502|504;error:string}>
}
