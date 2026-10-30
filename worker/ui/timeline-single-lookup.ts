import type{D1Database}from'@cloudflare/workers-types'
import type{HerdrUpstreamPort}from'../app/timeline-ports.js'
import type{TurnScope}from'../domain/timeline-record.js'
import{findTurn}from'../infra/d1-timeline-find.js'
import{reconcileTurn}from'../app/reconcile-turn.js'
import{toItem}from'../app/timeline-map.js'
import{importFromUpstream}from'./timeline-import-upstream.js'
export async function lookupTurn(db:D1Database,up:HerdrUpstreamPort,id:string,scope:TurnScope){
 const rec=await findTurn(db,scope,id)
 if(rec)return toItem(await reconcileTurn(db,up,rec))
 return importFromUpstream(db,up,id,scope.workspaceId,scope.ownerSubject)
}
