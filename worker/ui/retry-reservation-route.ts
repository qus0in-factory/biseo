import{type App,jsonNoStore}from'./timeline-guards.js'
import{submitContext}from'./timeline-submit-context.js'
import{parseSubmitMessageInput}from'../domain/message-input.js'
import{retryReservation}from'../app/retry-reservation.js'
import{queueUpstream}from'../infra/queue-upstream.js'
import{dispatchQueue}from'../app/dispatch-queue.js'
import{toItem}from'../app/timeline-map.js'
export function registerRetryReservation(app:App){
 app.post('/api/turns/:requestId/retry',async c=>{
  const x=await submitContext(c);if(!x.ok)return x.res
  const b=await c.req.json().catch(()=>null)
  const i=parseSubmitMessageInput({...b,text:'retry'})
  if(!i)return jsonNoStore(c,{error:'bad_request'},400)
  const q=queueUpstream(c.env),r=await retryReservation(x.db,q,c.req.param('requestId'),i,x.owner)
  if(!r||!('rec'in r))return jsonNoStore(c,{error:'conflict'},409)
  await dispatchQueue(x.db,q,i.workspaceId,i.paneId)
  return jsonNoStore(c,toItem(r.rec),202)
 })
}
