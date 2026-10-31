import type{D1Database}from'@cloudflare/workers-types'
import type{SubmitMessageInput}from'../domain/message-input.js'
import{acceptReservation}from'../app/accept-reservation.js'
import{queueUpstream}from'../infra/queue-upstream.js'
import{dispatchQueue}from'../app/dispatch-queue.js'
import{toItem}from'../app/timeline-map.js'
import{type Ctx,jsonNoStore}from'./timeline-guards.js'
export async function submitReservation(c:Ctx,db:D1Database,i:SubmitMessageInput,owner:string){
 const r=await acceptReservation(db,queueUpstream(c.env),i,owner)
 if(r.kind==='busy')return jsonNoStore(c,{error:'target_not_ready',reason:'agent_busy'},409)
 if(r.kind==='conflict')return jsonNoStore(c,{error:'conflict',reason:'request_id_payload_mismatch'},409)
 if(!('rec'in r))throw new Error('invalid_reservation')
 await dispatchQueue(db,queueUpstream(c.env),i.workspaceId,i.paneId)
 return jsonNoStore(c,toItem(r.rec),202)
}
