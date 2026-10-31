import type{D1Database}from'@cloudflare/workers-types'
import type{TurnRecord}from'../domain/timeline-record.js'
import type{QueuePort}from'./queue-port.js'
import{startTurn}from'../infra/d1-queue-start.js'
import{finishTurn}from'../infra/d1-queue-finish.js'
export async function executeClaim(db:D1Database,up:QueuePort,r:TurnRecord,token:string){
 const l={id:r.requestId,token,now:Date.now()}
 if(!await startTurn(db,l))return
 const accepted=await up.execute(r).catch(()=>false)
 if(!accepted)await finishTurn(db,{...l,now:Date.now()},'failed','delivery_uncertain')
}
