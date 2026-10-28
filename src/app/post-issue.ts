import type{TurnStatus}from'../domain/timeline.js'
import type{AgentInfo}from'../domain/herdr.js'
export type PostIssue={status:TurnStatus;errorCode:string}
export function postIssue(a:AgentInfo|undefined):PostIssue|null{
 if(!a)return {status:'failed',errorCode:'delivery_uncertain'}
 if(a.agent_status==='blocked')return {status:'blocked',errorCode:'agent_blocked'}
 if(a.agent_status==='working')return {status:'timeout',errorCode:'turn_state_uncertain'}
 return null
}
