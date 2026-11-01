import type{D1Database}from'@cloudflare/workers-types'
import type{QueuePort}from'./queue-port.js'
import type{SubmitMessageInput}from'../domain/message-input.js'
import{reserveTurn}from'./reserve-turn.js'
import{snapshotReservation}from'./snapshot-reservation.js'
import{existingReservation}from'./existing-reservation.js'
export async function acceptReservation(db:D1Database,q:QueuePort,i:SubmitMessageInput,owner:string){
 const old=await existingReservation(db,i,owner)
 if(old)return old
 const rec=await snapshotReservation(q,i,owner)
 const r=await reserveTurn(db,rec)
 return r.kind==='inserted'?{kind:'accepted' as const,rec}:r
}
