import{reconcilePending as rp}from'./scheduled-turns.js'
import{syncUsage as su}from'./scheduled-usage.js'
import{runStep}from'./scheduled-step.js'
import{acquireGate,BACKOFF}from'./scheduled-gate.js'
import{gateFailed,noteResult}from'./sync-control.js'
import type{TickStep}from'./infra/cron-tick-log.js'
export async function syncSteps(db:any,env:any,ws:string|null,o:TickStep[]){
 let g
 try{g=await acquireGate(db,ws)}catch{gateFailed(o);return}
 try{
  if(g.gated)o.push(await runStep('turn-reconcile',async()=>g.gated!),await runStep('usage-sync',async()=>g.gated!))
  else{
   const t=await runStep('turn-reconcile',async()=>await rp(db,env,ws!)?{status:'ok'}:{status:'fail',code:'exception'})
   const u=await runStep('usage-sync',async()=>await su(db,env)?{status:'ok'}:{status:'fail',code:'unknown'})
   o.push(t,u)
   await noteResult(db,BACKOFF,t.status!=='ok'||u.status!=='ok',o)
  }
 }finally{await g.release()}
}
