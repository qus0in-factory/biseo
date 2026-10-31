import type{D1Database}from'@cloudflare/workers-types'
import type{HerdrUpstreamPort}from'./timeline-ports.js'
import type{TurnRecord}from'../domain/timeline-record.js'
import{queueLease}from'../infra/d1-queue-current.js'
import{applyQueueResult}from'../infra/d1-queue-result.js'
export async function reconcileQueue(db:D1Database,up:HerdrUpstreamPort,r:TurnRecord){
 const l=await queueLease(db,r.requestId)
 if(!l)return r
 const x=await up.getTurn(r.requestId)
 if(!x.ok||x.data.requestId!==r.requestId||x.data.workspaceId!==r.workspaceId||x.data.paneId!==r.paneId)return r
 return applyQueueResult(db,r,l.token,x.data)
}
