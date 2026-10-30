import type{Context}from'hono'
import{streamSSE}from'hono/streaming'
import{paneSnapshot}from'../app/pane-snapshot.js'
import type{TurnDeps}from'../app/turn-deps.js'
import{sseLoop}from'./sse-loop.js'
import type{Wake}from'./wake.js'
export function runSse(c:Context,d:TurnDeps,ws:string,unsub:()=>void,wake:Wake,last?:string){
 return streamSSE(c,async stream=>{
  let off=()=>{},offLock=off
  const s=async()=>JSON.stringify({...await paneSnapshot(d.herdr,d.locks,ws,d.availability,d.limit,d.input),...(last&&{resumedFrom:last})})
  const loop=sseLoop(stream,async()=>stream.writeSSE({event:'pane.updated',data:await s(),retry:3000}),()=>{off(),offLock(),unsub()})
  off=d.store.subscribe(i=>{if(!loop.closed()&&i.workspaceId===ws)void stream.writeSSE({event:'turn.updated',data:JSON.stringify(i),id:String(i.seq)}).catch(loop.end)})
  offLock=d.locks.subscribe(loop.refresh)
  wake.set(loop.refresh,loop.end)
  stream.onAbort(loop.end)
  await loop.send()
  if(loop.closed())return
  loop.beat()
  await loop.ended
 })
}
