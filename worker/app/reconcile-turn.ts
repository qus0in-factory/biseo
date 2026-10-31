import type{D1Database}from'@cloudflare/workers-types'
import type{HerdrUpstreamPort}from'./timeline-ports.js'
import type{TurnRecord}from'../domain/timeline-record.js'
import{isPending}from'../domain/timeline-record.js'
import{applyUpstreamTurn}from'./apply-upstream-turn.js'
import{reconcileMissing}from'./reconcile-missing.js'
import{reconcileQueue}from'./reconcile-queue.js'
export async function reconcileTurn(db:D1Database,up:HerdrUpstreamPort,r:TurnRecord):Promise<TurnRecord>{
 if(!isPending(r.status))return r
 if(r.terminalId)return r.status==='queued'?r:reconcileQueue(db,up,r)
 const x=await up.getTurn(r.requestId)
 if(x.ok){
  if(x.data.workspaceId&&x.data.workspaceId!==r.workspaceId)return r
  return applyUpstreamTurn(db,r,x.data)
 }
 if(x.status===404)return reconcileMissing(db,r)
 return r
}
