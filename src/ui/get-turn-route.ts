import type{Context}from'hono'
import type{TurnStore}from'../app/turn-store.js'
export function getTurn(d:{store:TurnStore}){
 return async(c:Context)=>{
  const item=d.store.get(c.req.param('requestId')??'')
  return item?c.json(item):c.json({error:'not_found'},404)
 }
}
