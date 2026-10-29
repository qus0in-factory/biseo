import type{TurnDeps}from'./turn-deps.js'
import type{TurnInput}from'./turn-input.js'
import{fail}from'./turn-result.js'
import{existing}from'./turn-idempotency.js'
import{release}from'./turn-claim.js'
import{attemptCreate}from'./create-turn-attempt.js'
export async function createTurn(d:TurnDeps,i:TurnInput){
 const old=existing(d,i)
 if(old)return old
 if(!d.locks.reserveRequest(i.requestId))return fail(409,'conflict','request_in_flight')
 try{return await attemptCreate(d,i)}
 catch{release(d,i.paneId,i.requestId);return fail(502,'herdr_unavailable')}
}
