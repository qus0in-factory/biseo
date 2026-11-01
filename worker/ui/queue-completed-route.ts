import{type App,jsonNoStore}from'./timeline-guards.js'
import{requireDb}from'./storage-guard.js'
import{isSafeId}from'../domain/message-input.js'
import{completeReservation}from'../app/complete-reservation.js'
import{createHerdrUpstream}from'../infra/herdr-upstream.js'
import{queueUpstream}from'../infra/queue-upstream.js'
export function registerQueueCompleted(app:App){
 app.post('/api/queue/completed',async c=>{
  const d=requireDb(c);if(!d.ok)return d.res
  const b=await c.req.json().catch(()=>null)
  if(!b||!isSafeId(b.requestId)||!isSafeId(b.token))return jsonNoStore(c,{error:'bad_request'},400)
  const ok=await completeReservation(d.db,createHerdrUpstream(c.env,c),queueUpstream(c.env),b.requestId,b.token)
  return jsonNoStore(c,{ok},ok?200:404)
 })
}
