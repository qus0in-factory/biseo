import type{D1Database}from'@cloudflare/workers-types'
import type{SubmitMessageInput}from'../domain/message-input.js'
import{applyResult}from'../app/timeline-apply.js'
import{createHerdrUpstream}from'../infra/herdr-upstream.js'
import{deleteTurn}from'../infra/d1-timeline-delete.js'
import{type Ctx,jsonNoStore}from'./timeline-guards.js'
const determinate=(s:number)=>s===400||s===401||s===403||s===404||s===409
export async function submitUpstream(c:Ctx,db:D1Database,input:SubmitMessageInput){
 const r=await createHerdrUpstream(c.env,c).submitTurn(input)
 if(r.ok){
  await applyResult(db,input.requestId,r.data)
  return jsonNoStore(c,r.data,202)
 }
 if(determinate(r.status)){
  await deleteTurn(db,input.requestId)
  return jsonNoStore(c,r.body,r.status)
 }
 return jsonNoStore(c,{requestId:input.requestId,status:'queued',uncertain:true},202)
}
