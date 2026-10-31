import type{D1Database}from'@cloudflare/workers-types'
import type{Ctx}from'./timeline-guards.js'
import{cancelReservation}from'../app/cancel-reservation.js'
import{cancelTimelineMessage}from'../app/cancel-turn.js'
import{applyResult}from'../app/timeline-apply.js'
import{createHerdrUpstream}from'../infra/herdr-upstream.js'
import{toItem}from'../app/timeline-map.js'
export async function deleteReservation(c:Ctx,db:D1Database,id:string,owner:string){
 const rec=await cancelReservation(db,id,owner)
 if(rec)return{status:200 as const,body:toItem(rec)}
 const r=await cancelTimelineMessage(createHerdrUpstream(c.env,c),c.env.ALLOWED_WORKSPACE_ID,id)
 if(r.status===200&&r.body.status==='cancelled')await applyResult(db,id,r.body)
 return r
}
