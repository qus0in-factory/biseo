import type{Context}from'hono'
import{cancelTurn}from'../app/turn-queue-cancel.js'
import{dispatchPane}from'../app/turn-queue-dispatch.js'
import type{TurnDeps}from'../app/turn-deps.js'
export function deleteTurn(d:TurnDeps){
 return(c:Context)=>{
  const r=cancelTurn(d,c.req.param('requestId')??'')
  if(!r.ok)return c.json({error:r.error},r.status)
  void dispatchPane(d,r.item.paneId)
  return c.json({requestId:r.item.requestId,status:r.item.status})
 }
}
