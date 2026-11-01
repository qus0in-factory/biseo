import type{D1Database}from'@cloudflare/workers-types'
import type{HerdrUpstreamPort}from'./timeline-ports.js'
import type{QueuePort}from'./queue-port.js'
import{findTurn}from'../infra/d1-timeline-find.js'
import{reconcileQueue}from'./reconcile-queue.js'
import{dispatchQueue}from'./dispatch-queue.js'
export async function completeReservation(db:D1Database,up:HerdrUpstreamPort,q:QueuePort,id:string,token:string){
 const s=await db.prepare(`SELECT workspace_id AS workspaceId,owner_subject AS ownerSubject
 FROM timeline_turns WHERE request_id=? AND lease_token=? AND status='working' AND lease_until>?`)
 .bind(id,token,Date.now()).first<{workspaceId:string;ownerSubject:string}>()
 if(!s)return false
 const r=await findTurn(db,s,id)
 if(!r)return false
 const next=await reconcileQueue(db,up,r)
 if(next.status!=='working')await dispatchQueue(db,q,r.workspaceId,r.paneId)
 return true
}
