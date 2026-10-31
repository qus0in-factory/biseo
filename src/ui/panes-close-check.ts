import type{TurnDeps}from'../app/turn-deps.js'
import type{PaneInfo}from'../domain/herdr.js'
import {workspaceIssue}from'../domain/workspace.js'
import {isCoordinatorLabel}from'../infra/coordinator-panels.js'
export async function closePaneCheck(d:TurnDeps,id:string):Promise<{s:200|400|403|404|409|502;e:string}|null>{
 const p=await d.herdr.getPane(id).catch(()=>undefined)
 if(!p)return{s:404,e:'pane_not_found'}
 const w=workspaceIssue(d.allowedWorkspaceId,p.workspace_id)
 if(w)return{s:403,e:w}
 if(isCoordinatorLabel(p.label))return{s:403,e:'coordinator_protected'}
 if(p.agent_status==='working'||p.agent_status==='blocked')return{s:409,e:'pane_busy'}
 if(d.locks.has(id))return{s:409,e:'pane_inflight'}
 if(d.queue.has(id))return{s:409,e:'pending_reservations'}
 return null
}
