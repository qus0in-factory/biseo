import type{AgentInfo,AgentSession}from'./herdr.js'
import type{DisabledReason,PaneStatus}from'./timeline.js'
import {captureSupported}from'./capture-support.js'
type A=AgentInfo|undefined
export function paneReason(status:PaneStatus,kind:string|null,a:A,locked:boolean,session:AgentSession|undefined):DisabledReason{
 if(!kind)return 'no_agent_in_pane'
 if(locked||a?.launch_pending===true||status==='working')return 'agent_busy'
 if(status==='blocked')return 'agent_blocked'
 if(status==='unknown'||a?.interactive_ready===false)return 'agent_unknown'
 return captureSupported(session)?null:'response_capture_unavailable'
}
