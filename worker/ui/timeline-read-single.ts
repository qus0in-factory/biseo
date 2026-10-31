import{isSafeId}from'../domain/message-input.js'
import{createHerdrUpstream}from'../infra/herdr-upstream.js'
import{type App,jsonNoStore}from'./timeline-guards.js'
import{readContext}from'./timeline-read-context.js'
import{lookupTurn}from'./timeline-single-lookup.js'
import{queueUpstream}from'../infra/queue-upstream.js'
export function registerTimelineSingle(app:App){
 app.get('/api/timeline/messages/:requestId',async c=>{
  const x=await readContext(c);if(!x.ok)return x.res
  const id=c.req.param('requestId')
  if(!isSafeId(id))return jsonNoStore(c,{error:'bad_request'},400)
  const up=createHerdrUpstream(c.env,c)
  const item=await lookupTurn(x.db,up,id,{workspaceId:x.ws,ownerSubject:x.owner},queueUpstream(c.env))
  return item?jsonNoStore(c,item,200):jsonNoStore(c,{error:'not_found'},404)
 })
}
