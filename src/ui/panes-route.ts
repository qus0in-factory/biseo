import type{Context}from'hono'
import {paneSnapshot}from'../app/pane-snapshot.js'
import {workspaceIssue}from'../domain/workspace.js'
import type{TurnDeps}from'../app/turn-deps.js'
export function panesRoute(d:TurnDeps){
 return async(c:Context)=>{
  const ws=c.req.param('wsId')??''
  const w=workspaceIssue(d.allowedWorkspaceId,ws)
  if(w)return c.json({error:w},w==='workspace_not_allowed'?403:503)
  try{return c.json(await paneSnapshot(d.herdr,d.locks,ws,d.availability))}
  catch{return c.json({error:'herdr_unavailable'},502)}
 }
}
