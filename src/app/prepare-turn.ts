import {captureReason}from'../domain/capture-support.js'
import {findTarget,targetIssue,type Target}from'../domain/turn-policy.js'
import type{CapturePort,CaptureReader,HerdrPort}from'./ports.js'
import type{TurnInput}from'./turn-input.js'
import {fail,type Fail}from'./turn-result.js'
type Deps={herdr:HerdrPort;capture:CapturePort}
export async function prepare(d:Deps,input:TurnInput):Promise<{target:Target;reader:CaptureReader|null;reason:string|null}|Fail>{
 const [panes,agents]=await Promise.all([d.herdr.listPanes(input.workspaceId),d.herdr.listAgents()])
 const target=findTarget(panes,agents,input.paneId)
 if(!target)return fail(404,'target_not_found')
 const issue=targetIssue(target)
 if(issue)return fail(409,issue)
 const session=target.agent?.agent_session??target.pane.agent_session??undefined
 const reader=await d.capture.begin(session,target.pane.cwd,input.text)
 return {target,reader,reason:reader?null:captureReason(session)}
}
