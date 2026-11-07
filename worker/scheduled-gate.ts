import{acquireLease,releaseLease}from'./infra/d1-lease.js'
import{nextReadyAt}from'./infra/d1-backoff.js'
import type{TickOutcome}from'./infra/cron-tick-log.js'
import type{D1Database}from'@cloudflare/workers-types'
export const KEY='cron:sync',BACKOFF=KEY+':backoff'
const SKIP={status:'skipped'}as const
export type Gate={gated:TickOutcome|null;release:()=>Promise<void>}
export async function acquireGate(db:D1Database,ws:string|null):Promise<Gate>{
 let gated:TickOutcome|null=ws?null:SKIP,leased=false
 const holder=crypto.randomUUID()
 if(!gated){
  leased=await acquireLease(db,KEY,holder,55000)
  if(!leased)gated=SKIP
 }
 try{if(!gated&&await nextReadyAt(db,BACKOFF)>Date.now())gated=SKIP}
 catch(e){if(leased)await releaseLease(db,KEY,holder).catch(()=>{});throw e}
 return{gated,release:async()=>{if(leased)await releaseLease(db,KEY,holder).catch(()=>{})}}
}
