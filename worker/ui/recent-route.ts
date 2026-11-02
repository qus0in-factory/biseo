import{type App,jsonNoStore}from'./timeline-guards.js'
import{submitContext}from'./timeline-submit-context.js'
import{verifyAllowedWorkspace}from'../domain/workspace-guard.js'
import{recentUpstream}from'../infra/recent-upstream.js'
import{recentResult}from'./recent-result.js'
export function registerRecentRoute(app:App){
 app.post('/api/panes/:paneId/recent',async context=>{
  const access=await submitContext(context)
  if(!access.ok)return access.res
  const scope=verifyAllowedWorkspace(context.env.ALLOWED_WORKSPACE_ID)
  if(!scope.ok)return jsonNoStore(context,{error:scope.error},scope.status)
  const pane=context.req.param('paneId'),workspace=scope.workspaceId
  const result=await recentUpstream(context.env,workspace,pane)
  if(!result.ok)return jsonNoStore(context,result.body,result.status)
  return recentResult(context,access.db,result.data.recent,workspace,pane,access.owner)
 })
}
