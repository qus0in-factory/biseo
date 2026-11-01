import{listTurns}from'../infra/d1-timeline-list.js'
import{reconcileTurn}from'../app/reconcile-turn.js'
import{toItem}from'../app/timeline-map.js'
import{createHerdrUpstream}from'../infra/herdr-upstream.js'
import{type App,jsonNoStore}from'./timeline-guards.js'
import{readContext}from'./timeline-read-context.js'
import{pageOptions}from'./timeline-page-params.js'
import{queueUpstream}from'../infra/queue-upstream.js'
export function registerTimelineList(app:App){
 app.get('/api/timeline/messages',async c=>{
  const x=await readContext(c,c.req.query('workspaceId'));if(!x.ok)return x.res
  const up=createHerdrUpstream(c.env,c)
  const o=pageOptions(c.req.query())
  const{rows,hasMore}=await listTurns(x.db,{workspaceId:x.ws,ownerSubject:x.owner},o)
  const items=await Promise.all(rows.map(r=>reconcileTurn(x.db,up,r,queueUpstream(c.env)).catch(()=>r)))
  const nextBefore=hasMore?rows[rows.length-1]?.seq??null:null
  return jsonNoStore(c,{items:items.map(toItem),hasMore,nextBefore},200)
 })
}
