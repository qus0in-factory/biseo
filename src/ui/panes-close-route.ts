import type{Context}from'hono'
import type{TurnDeps}from'../app/turn-deps.js'
import {closePaneCheck}from'./panes-close-check.js'
const C={'Cache-Control':'no-store'}
export function closePaneRoute(d:TurnDeps){
 return async(c:Context)=>{
  const id=c.req.param('paneId')??''
  if(!/^[A-Za-z0-9:_-]+$/.test(id))return c.json({error:'invalid_pane'},400,C)
  const x=await closePaneCheck(d,id)
  if(x)return c.json({error:x.e},x.s,C)
  if(!d.herdr.closePane)return c.json({error:'herdr_unavailable'},502,C)
  try{await d.herdr.closePane(id);return c.json({ok:true,paneId:id},200,C)}
  catch{return c.json({error:'herdr_unavailable'},502,C)}
 }
}
