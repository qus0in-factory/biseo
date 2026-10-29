import type{D1Database}from'@cloudflare/workers-types'
import{createHerdrUpstream}from'./infra/herdr-upstream.js'
import{pendingTurns}from'./infra/d1-timeline-pending.js'
import{reconcileTurn}from'./app/reconcile-turn.js'
import type{CronEnv}from'./scheduled-env.js'
export async function reconcilePending(db:D1Database,env:CronEnv,workspaceId:string,limit=20){
 const up=createHerdrUpstream(env)
 for(const r of await pendingTurns(db,workspaceId,limit)){
  try{await reconcileTurn(db,up,r)}catch{return false}
 }
 return true
}
