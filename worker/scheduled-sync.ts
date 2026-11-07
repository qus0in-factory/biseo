import{reconcilePending as rp}from'./scheduled-turns.js'
import{syncUsage as su}from'./scheduled-usage.js'
import{recordResult}from'./infra/d1-backoff.js'
import{runStep}from'./scheduled-step.js'
import{acquireGate,BACKOFF}from'./scheduled-gate.js'
import type{TickStep}from'./infra/cron-tick-log.js'
import type{CronEnv}from'./scheduled-env.js'
import type{D1Database}from'@cloudflare/workers-types'
export async function syncSteps(db:D1Database,env:CronEnv,ws:string|null,o:TickStep[]){
 const g=await acquireGate(db,ws)
 try{
  if(g.gated){
   o.push(await runStep('turn-reconcile',async()=>g.gated!),await runStep('usage-sync',async()=>g.gated!))
  }else{
   const t=await runStep('turn-reconcile',async()=>await rp(db,env,ws!)?{status:'ok'}:{status:'fail',code:'exception'})
   const u=await runStep('usage-sync',async()=>await su(db,env)?{status:'ok'}:{status:'fail',code:'unknown'})
   o.push(t,u)
   await recordResult(db,BACKOFF,t.status!=='ok'||u.status!=='ok')
  }
 }finally{await g.release()}
}
