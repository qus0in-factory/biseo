import type{Context}from'hono'
import{interruptPane}from'../app/interrupt-pane.js'
import type{TurnDeps}from'../app/turn-deps.js'
export function interruptRoute(d:TurnDeps){
 return async(c:Context)=>{
  const body=await c.req.json().catch(()=>null) as {key?:unknown}|null
  const r=await interruptPane(d,c.req.param('paneId')??'',body?.key)
  return c.json(r.body,r.status)
 }
}
