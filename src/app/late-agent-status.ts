import type{AgentInfo}from'../domain/herdr.js'
import type{TurnStatus}from'../domain/timeline.js'
export type AgentSignal={status:TurnStatus;err:string}
export function mapAgentSignal(a:AgentInfo|undefined):AgentSignal|null{
 if(!a)return {status:'failed',err:'no_agent_in_pane'}
 if(a.agent_status==='blocked')return {status:'blocked',err:'agent_blocked'}
 if(a.agent_status==='unknown')return {status:'failed',err:'agent_unknown'}
 return null
}
