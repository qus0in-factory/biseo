import test from'node:test'
import assert from'node:assert/strict'
import {Hono}from'hono'
import {runSse}from'./events-sse.js'
import {Wake}from'./wake.js'
import {lockDeps,readEvent,TrackedLocks}from'./test-util/events-lock-fixture.js'
import {until}from'../test-util/test-wait.test-util.js'
import {PaneLocks}from'../app/pane-locks.js'
import {lockDeps,readEvent}from'./test-util/events-lock-fixture.js'
import {agent,pane}from'../app/test-util/turn-data-fixture.js'

{
test('closing SSE removes its lock subscription',async()=>{
 const l=new TrackedLocks(),app=new Hono()
 app.get('/e',c=>runSse(c,lockDeps(l) as never,'w',()=>{},new Wake()))
 const r=await app.request('/e')
 await readEvent(r.body!,/pane\.updated/)
 await r.body?.cancel()
 await until(()=>l.off===1,2000,10)
 assert.equal(l.off,1)
})
}
{
test('all SSE clients receive lock release',async()=>{
 const l=new PaneLocks(),app=new Hono()
 app.get('/e',c=>runSse(c,lockDeps(l) as never,'w',()=>{},new Wake()))
 const a=await app.request('/e'),b=await app.request('/e')
 try{
  await Promise.all([readEvent(a.body!,/pane\.updated/),readEvent(b.body!,/pane\.updated/)])
  l.reserve('w:p1','r1')
  const [x,y]=await Promise.all([readEvent(a.body!,/agent_busy/),readEvent(b.body!,/agent_busy/)])
  assert.match(x,/"paneId":"w:p1"/)
  assert.match(y,/"paneId":"w:p1"/)
 }finally{await Promise.all([a.body?.cancel(),b.body?.cancel()])}
})
}
{
test('lock release pushes pane.updated',async()=>{
 const l=new PaneLocks()
 l.reserve('w:p1','r1')
 const app=new Hono()
 app.get('/e',c=>runSse(c,lockDeps(l) as never,'w',()=>{},new Wake()))
 const r=await app.request('/e')
 try{
  assert.match(await readEvent(r.body!,/pane\.updated/),/"disabledReason":"agent_busy"/)
  l.release('w:p1','r1')
  assert.match(await readEvent(r.body!,/"sendable":true/),/"paneId":"w:p1"/)
 }finally{await r.body?.cancel().catch(()=>{})}
})
}
{
test('lock change never adds another workspace pane',async()=>{
 const l=new PaneLocks()
 const other={...pane,pane_id:'x:p2',workspace_id:'x'}
 const d=lockDeps(l,async()=>[pane],async()=>[agent,{...agent,pane_id:'x:p2'}])
 const app=new Hono()
 app.get('/e',c=>runSse(c,d as never,'w',()=>{},new Wake()))
 const r=await app.request('/e')
 try{
  await readEvent(r.body!,/pane\.updated/)
  l.reserve(other.pane_id,'r2')
  const next=await readEvent(r.body!,/"sendable":true/)
  assert.match(next,/"paneId":"w:p1"/)
  assert.doesNotMatch(next,/"paneId":"x:p2"/)
 }finally{await r.body?.cancel().catch(()=>{})}
})
}
