import type{D1Database}from'@cloudflare/workers-types'
import type{QueuePort}from'./queue-port.js'
import type{HerdrUpstreamPort}from'./timeline-ports.js'
import{recoverQueue}from'../infra/d1-queue-recover.js'
import{scanQueue}from'../infra/d1-queue-scan.js'
import{reconcileQueue}from'./reconcile-queue.js'
import{dispatchQueue}from'./dispatch-queue.js'
export async function runD1Queue(db:D1Database,q:QueuePort,up:HerdrUpstreamPort){
 await recoverQueue(db)
 const s=await scanQueue(db)
 for(const r of s.working)await reconcileQueue(db,up,r).catch(()=>r)
 for(const p of s.panels)await dispatchQueue(db,q,p.ws,p.pane).catch(()=>{})
}
