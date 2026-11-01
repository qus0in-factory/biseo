import type{Context}from'hono'
import type{TurnDeps}from'../app/turn-deps.js'
import{renamePaneCheck as r}from'./panes-rename-check.js'
const C={'Cache-Control':'no-store'}
export function renamePaneRoute(d:TurnDeps){
 return async(c:Context)=>{
  const id=c.req.param('paneId')??''
  if(!/^[A-Za-z0-9:_-]+$/.test(id))return c.json({error:'invalid_pane'},400,C)
  const b=await c.req.json().catch(()=>null) as Record<string,unknown>|null
  const n=b?.name??b?.label
  const x=await r(d,id,n)
  if(x.e)return c.json({error:x.e},x.s,C)
  if(!d.herdr.renamePane)return c.json({error:'herdr_unavailable'},502,C)
  const f:string[]=[]
  try{await d.herdr.renamePane(id,String(n))}catch{f.push('pane')}
  if(x.pane?.tab_id&&d.herdr.renameTab)try{await d.herdr.renameTab(x.pane.tab_id,String(n))}catch{f.push('tab')}
  if(d.herdr.renameAgent)try{await d.herdr.renameAgent(id,String(n))}catch{f.push('agent')}
  if(f.length)return c.json({error:'rename_failed',failed:f},500,C)
  return c.json({ok:true,paneId:id,name:n},200,C)
 }
}