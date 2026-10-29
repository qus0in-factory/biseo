import {paneName}from'../domain/pane-name.js'
import type{Target}from'../domain/turn-policy.js'
import type{TimelineItem}from'../domain/timeline.js'
import type{TurnInput}from'./turn-input.js'
export function makeItem(input:TurnInput,t:Target,seq:number):TimelineItem{
 const now=new Date().toISOString()
 return {requestId:input.requestId,workspaceId:input.workspaceId,paneId:input.paneId,targetName:paneName(t.pane,t.agent),agentKind:t.agent?.agent??t.pane.agent??null,promptText:input.text,status:'queued',responseText:null,errorCode:null,createdAt:now,seq,completedAt:null}
}
