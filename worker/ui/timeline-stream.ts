import {createHerdrUpstream}from'../infra/herdr-upstream.js'
import {resolveRequestId,trackSse}from'../infra/upstream-log.js'
import {createBoundedStream}from'./sse-bounded-stream.js'
import {validateStreamRequest}from'./stream-validate.js'
import {type App,jsonNoStore}from'./timeline-guards.js'
const SSE={'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-store',Connection:'keep-alive'}
export function registerStreamRoute(app:App){
 app.get('/api/timeline/stream',async c=>{
  const v=await validateStreamRequest(c)
  if(!v.ok)return v.res
  const ac=new AbortController(),id=resolveRequestId(c),sig=c.req.raw.signal
  sig.addEventListener('abort',()=>ac.abort(),{once:true})
  const u=await createHerdrUpstream(c.env,id).openEventStream(v.workspaceId,v.lastId,ac.signal)
  if(!(u instanceof Response)||!u.body)return jsonNoStore(c,{error:u instanceof Response?'bad_gateway':u.error},502)
  return new Response(trackSse(createBoundedStream(u.body,v.expMs,ac),id,sig),{status:200,headers:SSE})
 })
}
