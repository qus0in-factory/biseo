import{listTurns}from'../infra/d1-timeline-list.js'
import{reconcileTurn}from'../app/reconcile-turn.js'
import{toItem}from'../app/timeline-map.js'
import{createHerdrUpstream}from'../infra/herdr-upstream.js'
import{type App,jsonNoStore}from'./timeline-guards.js'
import{readContext}from'./timeline-read-context.js'
const lim=(v:string|undefined)=>Math.min(Math.max(Number(v)||20,1),50)
export function registerTimelineList(app:App){
 app.get('/api/timeline/messages',async c=>{
  const x=await readContext(c,c.req.query('workspaceId'));if(!x.ok)return x.res
  const up=createHerdrUpstream(c.env,c)
  const rows=await listTurns(x.db,{workspaceId:x.ws,ownerSubject:x.owner},lim(c.req.query('limit')))
  const items=await Promise.all(rows.map(r=>reconcileTurn(x.db,up,r).catch(()=>r)))
  return jsonNoStore(c,{items:items.map(toItem)},200)
 })
}
