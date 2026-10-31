import type{Context}from'hono'
import type{TurnDeps}from'../app/turn-deps.js'
import {workspaceIssue}from'../domain/workspace.js'
import {resolveOpenPane}from'./panes-open-resolve.js'
const C={'Cache-Control':'no-store'}
export function openPaneRoute(d:TurnDeps){
 return async(c:Context)=>{
  const ws=d.allowedWorkspaceId
  if(workspaceIssue(ws??'',ws??''))return c.json({error:'workspace_not_configured'},503)
  const b=await c.req.json().catch(()=>null) as Record<string,unknown>|null
  const r=resolveOpenPane(b)
  if(r.error)return c.json({error:r.error.e},r.error.s,C)
  if(!d.herdr.createTab)return c.json({error:'herdr_unavailable'},502,C)
  try{const x=await d.herdr.createTab(ws!,r.label);if(r.template?.kind&&d.herdr.startAgent)try{await d.herdr.startAgent(r.label,r.template.kind,x.paneId,r.template.args??[])}catch{};return c.json({ok:true,workspaceId:ws,paneId:x.paneId,tabId:x.tabId,templateId:r.template?.id},200,C)}
  catch{return c.json({error:'herdr_unavailable'},502,C)}
 }
}
