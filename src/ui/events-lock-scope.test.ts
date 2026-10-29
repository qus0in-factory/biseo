import test from'node:test'
import assert from'node:assert/strict'
import {Hono}from'hono'
import {agent,pane}from'../app/turn-fixture-data.test.js'
import {PaneLocks}from'../app/pane-locks.js'
import {runSse}from'./events-sse.js'
import {Wake}from'./wake.js'
import {lockDeps,readEvent}from'./events-lock-fixture.js'
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
