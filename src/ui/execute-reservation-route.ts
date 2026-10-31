import type{Context}from'hono'
import type{TurnDeps}from'../app/turn-deps.js'
import{parseInput}from'../app/turn-input.js'
import{existing}from'../app/turn-idempotency.js'
import{executeReservation}from'../app/execute-reservation.js'
import{queueCompletion}from'../infra/queue-completion.js'
export function executeReservationRoute(d:TurnDeps){
 return async(c:Context)=>{
  const body=await c.req.json().catch(()=>null),i=parseInput(body)
  if(typeof i==='string'||typeof body.terminalId!=='string'||!body.terminalId)return c.json({error:'invalid_body'},400)
  const old=existing(d,i)
  if(old)return c.json({error:'already_attempted'},409)
  if(!d.locks.reserveRequest(i.requestId))return c.json({error:'request_in_flight'},409)
  const stop=queueCompletion(d.store,i.requestId,body.queueToken)
  try{return c.json(await executeReservation(d,i,body.terminalId),202)}
  catch{stop();return c.json({error:'execution_rejected'},409)}
  finally{d.locks.releaseRequest(i.requestId)}
 }
}
