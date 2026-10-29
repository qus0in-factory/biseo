import test from'node:test'
import assert from'node:assert/strict'
import {Hono}from'hono'
import {PaneLocks}from'../app/pane-locks.js'
import {runSse}from'./events-sse.js'
import {Wake}from'./wake.js'
import {lockDeps,readEvent}from'./events-lock-fixture.js'
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
