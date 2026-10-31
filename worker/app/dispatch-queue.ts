import type{D1Database}from'@cloudflare/workers-types'
import type{QueuePort}from'./queue-port.js'
import{claimTurn}from'../infra/d1-queue-claim.js'
import{finishTurn}from'../infra/d1-queue-finish.js'
import{parkTurn}from'../infra/d1-queue-park.js'
import{executeClaim}from'./execute-claim.js'
import{QUEUE_LEASE_MS}from'../domain/queue-policy.js'
export async function dispatchQueue(db:D1Database,up:QueuePort,ws:string,pane:string){
 while(true){
 const token=crypto.randomUUID(),now=Date.now()
 const r=await claimTurn(db,ws,pane,token,now,QUEUE_LEASE_MS)
 if(!r)return
 const l={id:r.requestId,token,now}
 const t=await up.target(ws,pane).catch(()=>undefined)
 if(t===null||t&&t.terminalId!==r.terminalId){await finishTurn(db,l,'failed','target_unclear');continue}
 if(!t?.ready)return parkTurn(db,l,t===undefined)
 if(await executeClaim(db,up,r,token))return
 }
}
