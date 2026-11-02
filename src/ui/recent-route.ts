import type{Hono}from'hono'
import type{AppDeps}from'./app-deps.js'
import{recentResponse}from'../app/recent-response.js'
import{workspaceIssue}from'../domain/workspace.js'
export function registerRecentRoute(app:Hono,deps:AppDeps){
 app.post('/herdr/workspaces/:wsId/panes/:paneId/recent',async context=>{
  const workspace=context.req.param('wsId')
  const issue=workspaceIssue(deps.allowedWorkspaceId,workspace)
  if(issue)return context.json({error:issue},403)
  try{
   const result=await recentResponse(deps.herdr,workspace,context.req.param('paneId'))
   return context.json({recent:result})
  }catch{return context.json({error:'capture_failed'},502)}
 })
}
