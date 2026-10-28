import type{Context}from'hono'
import type{TurnDeps}from'../app/turn-deps.js'
import {isCloseEvent}from'../domain/herdr-event-names.js'
import {workspaceIssue}from'../domain/workspace.js'
import {subscribe}from'../infra/herdr-events.js'
import {runSse}from'./events-sse.js'
import {Wake}from'./wake.js'
export function eventsRoute(d:TurnDeps){
 return async(c:Context)=>{
  const ws=c.req.query('workspaceId')??''
  const w=workspaceIssue(d.allowedWorkspaceId,ws)
  if(w)return c.json({error:w},w==='workspace_not_allowed'?403:503)
  const wake=new Wake()
  let unsub:()=>void
  try{
   const panes=await d.herdr.listPanes(ws)
   unsub=await subscribe(panes.map(p=>p.pane_id),e=>isCloseEvent(e)?wake.end():wake.call(),()=>wake.end())
  }catch{return c.json({error:'event_source_unavailable'},502)}
  return runSse(c,d,ws,unsub,wake)
 }
}
