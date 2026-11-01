import type{D1Database}from'@cloudflare/workers-types'
import type{QueuePort}from'./queue-port.js'
import type{SubmitMessageInput}from'../domain/message-input.js'
import{findTurn}from'../infra/d1-timeline-find.js'
import{acceptReservation}from'./accept-reservation.js'
export async function retryReservation(db:D1Database,q:QueuePort,id:string,i:SubmitMessageInput,owner:string){
 const old=await findTurn(db,{workspaceId:i.workspaceId,ownerSubject:owner},id)
 if(!old)return null
 if(old.status!=='failed'||!['delivery_uncertain','target_unclear'].includes(old.errorCode??''))return null
 if(i.requestId===id)return null
 return acceptReservation(db,q,{...i,text:old.promptText},owner)
}
