import type{Context}from'hono'
import type{TurnDeps}from'../app/turn-deps.js'
import {workspaceIssue}from'../domain/workspace.js'
export function renamePaneRoute(d:TurnDeps){
 return async(c:Context)=>{
  const id=c.req.param('paneId')??''
  if(!/^[A-Za-z0-9:_-]+$/.test(id))return c.json({error:'invalid_pane'},400,{'Cache-Control':'no-store'})
  const body=await c.req.json().catch(()=>null) as Record<string,unknown>|null
  const name=body?.name??body?.label
  if(typeof name!=='string'||!/^[A-Za-z0-9:_ -]{1,64}$/.test(name))return c.json({error:'invalid_name'},400,{'Cache-Control':'no-store'})
  let pane:any
  try{pane=await d.herdr.getPane(id)}catch{pane=undefined}
  if(!pane)return c.json({error:'pane_not_found'},404,{'Cache-Control':'no-store'})
  const wi=workspaceIssue(d.allowedWorkspaceId,pane.workspace_id)
  if(wi)return c.json({error:wi},403,{'Cache-Control':'no-store'})
  if(!d.herdr.renamePane)return c.json({error:'herdr_unavailable'},502,{'Cache-Control':'no-store'})
  const failed:string[]=[]
  try{await d.herdr.renamePane(id,name)}catch{failed.push('pane')}
  if(pane.tab_id&&d.herdr.renameTab)try{await d.herdr.renameTab(pane.tab_id,name)}catch{failed.push('tab')}
  if(d.herdr.renameAgent)try{await d.herdr.renameAgent(id,name)}catch{failed.push('agent')}
  if(failed.length)return c.json({error:'rename_failed',failed},500,{'Cache-Control':'no-store'})
  return c.json({ok:true,paneId:id,name},200,{'Cache-Control':'no-store'})
 }
}
