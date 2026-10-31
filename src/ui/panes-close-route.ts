import type{Context}from'hono'
import type{TurnDeps}from'../app/turn-deps.js'
import {workspaceIssue}from'../domain/workspace.js'
import {isCoordinatorLabel}from'../infra/coordinator-panels.js'
export function closePaneRoute(d:TurnDeps){
 return async(c:Context)=>{
  const id=c.req.param('paneId')??''
  if(!/^[A-Za-z0-9:_-]+$/.test(id))return c.json({error:'invalid_pane'},400,{'Cache-Control':'no-store'})
  let pane:any
  try{pane=await d.herdr.getPane(id)}catch{pane=undefined}
  if(!pane)return c.json({error:'pane_not_found'},404,{'Cache-Control':'no-store'})
  const wi=workspaceIssue(d.allowedWorkspaceId,pane.workspace_id)
  if(wi)return c.json({error:wi},403,{'Cache-Control':'no-store'})
  if(isCoordinatorLabel(pane.label))return c.json({error:'coordinator_protected'},403,{'Cache-Control':'no-store'})
  if(pane.agent_status==='working'||pane.agent_status==='blocked')return c.json({error:'pane_busy'},409,{'Cache-Control':'no-store'})
  if(d.locks.has(id))return c.json({error:'pane_inflight'},409,{'Cache-Control':'no-store'})
  if(d.queue.has(id))return c.json({error:'pending_reservations'},409,{'Cache-Control':'no-store'})
  if(!d.herdr.closePane)return c.json({error:'herdr_unavailable'},502,{'Cache-Control':'no-store'})
  try{await d.herdr.closePane(id);return c.json({ok:true,paneId:id},200,{'Cache-Control':'no-store'})}
  catch{return c.json({error:'herdr_unavailable'},502,{'Cache-Control':'no-store'})}
 }
}
