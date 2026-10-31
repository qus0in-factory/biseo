import{type App,jsonNoStore}from'./timeline-guards.js'
import{queuedRecord}from'../app/queued-turn.js'
import{reserveTurn}from'../app/reserve-turn.js'
import{toItem}from'../app/timeline-map.js'
import{parseSubmit}from'./timeline-submit-parse.js'
import{submitContext}from'./timeline-submit-context.js'
import{submitUpstream}from'./timeline-submit-upstream.js'
export function registerSubmitRoute(app:App){
 app.post('/api/timeline/messages',async c=>{
  const x=await submitContext(c);if(!x.ok)return x.res
  const p=await parseSubmit(c);if(!p.ok)return p.res
  const now=new Date().toISOString()
  const r=await reserveTurn(x.db,queuedRecord(p.input,x.owner,p.ws,now))
  if(r.kind==='busy')return jsonNoStore(c,{error:'target_not_ready',reason:'agent_busy'},409)
  if(r.kind==='conflict')return jsonNoStore(c,{error:'conflict',reason:'request_id_payload_mismatch'},409)
  if(r.kind==='existing'){
   return jsonNoStore(c,toItem(r.rec),202)
  }
  return submitUpstream(c,x.db,p.input)
 })
}
