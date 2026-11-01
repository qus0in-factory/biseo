import type{Context}from'hono'
import type{TurnDeps}from'../app/turn-deps.js'
import{queueTarget}from'../app/queue-target.js'
export function queueTargetRoute(d:TurnDeps){
 return async(c:Context)=>{
  try{
   const t=await queueTarget(d.herdr,c.req.param('wsId')??'',c.req.param('paneId')??'')
   return t?c.json({terminalId:t.terminalId,ready:t.ready}):c.json({error:'target_not_found'},404)
  }catch{return c.json({error:'herdr_unavailable'},502)}
 }
}
