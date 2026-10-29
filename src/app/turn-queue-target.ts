import{findTarget,targetIssue,type Target}from'../domain/turn-policy.js'
import type{CaptureReader}from'./ports.js'
import type{TurnDeps}from'./turn-deps.js'
import type{TurnInput}from'./turn-input.js'
import{fail,type Fail}from'./turn-result.js'
export type Resolved={target:Target;issue:string|null}|Fail
export async function resolveTarget(d:TurnDeps,input:TurnInput):Promise<Resolved>{
 const[panes,agents]=await Promise.all([d.herdr.listPanes(input.workspaceId),d.herdr.listAgents()])
 const target=findTarget(panes,agents,input.paneId)
 if(!target)return fail(404,'target_not_found')
 return{target,issue:targetIssue(target)}
}
export async function beginReader(d:TurnDeps,input:TurnInput,target:Target):Promise<CaptureReader|null>{
 const s=target.agent?.agent_session??target.pane.agent_session??undefined
 return d.capture.begin(s,target.pane.cwd,input.text)
}
