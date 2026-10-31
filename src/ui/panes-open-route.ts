import type{Context}from'hono'
import type{TurnDeps}from'../app/turn-deps.js'
import {workspaceIssue}from'../domain/workspace.js'
import {findPaneTemplate}from'../infra/pane-templates.js'
import {isCoordinatorLabel}from'../infra/coordinator-panels.js'
export function openPaneRoute(d:TurnDeps){
 return async(c:Context)=>{
  const ws=d.allowedWorkspaceId
  if(workspaceIssue(ws??'',ws??''))return c.json({error:'workspace_not_configured'},503)
  const body=await c.req.json().catch(()=>null) as Record<string,unknown>|null
  const templateId=body?.templateId??body?.template
  const rawName=body?.name??body?.label
  if(rawName!==undefined&&(typeof rawName!=='string'||!/^[A-Za-z0-9:_ -]{1,64}$/.test(rawName)))return c.json({error:'invalid_name'},400)
  let template:ReturnType<typeof findPaneTemplate>
  if(templateId!==undefined){
   if(typeof templateId!=='string')return c.json({error:'invalid_template'},400)
   template=findPaneTemplate(templateId)
   if(!template)return c.json({error:'template_not_allowed'},403)
  }
  const label=typeof rawName==='string'?rawName:(template?.label??'panel')
  if(isCoordinatorLabel(label)||isCoordinatorLabel(template?.label))return c.json({error:'coordinator_protected'},403)
  if(!d.herdr.createTab)return c.json({error:'herdr_unavailable'},502)
  try{
   const r=await d.herdr.createTab(ws!,label)
   if(template?.kind&&d.herdr.startAgent)try{await d.herdr.startAgent(label,template.kind,r.paneId,template.args)}catch{}
   return c.json({ok:true,workspaceId:ws,paneId:r.paneId,tabId:r.tabId,templateId:template?.id},200,{'Cache-Control':'no-store'})
  }catch{return c.json({error:'herdr_unavailable'},502)}
 }
}
