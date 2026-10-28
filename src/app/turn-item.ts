import type{Target}from'../domain/turn-policy.js'
import type{TimelineItem}from'../domain/timeline.js'
import type{CaptureReader}from'./ports.js'
import type{TurnInput}from'./turn-input.js'
export function makeItem(input:TurnInput,t:Target,seq:number,reader:CaptureReader|null,reason:string|null):TimelineItem{
 const now=new Date().toISOString(),queued=!!reader
 return {requestId:input.requestId,workspaceId:input.workspaceId,paneId:input.paneId,targetName:t.pane.label??t.pane.title??t.pane.terminal_title_stripped??t.pane.pane_id,agentKind:t.agent?.agent??t.pane.agent??null,promptText:input.text,status:queued?'queued':'capture_unavailable',responseText:null,errorCode:queued?null:`response_capture_unavailable:${reason}`,createdAt:now,seq,completedAt:queued?null:now}
}
