import test from'node:test'
import assert from'node:assert/strict'
import {Hono}from'hono'
import {PaneLocks}from'../app/pane-locks.js'
import {runSse}from'./events-sse.js'
import {Wake}from'./wake.js'
import {lockDeps,readEvent}from'./events-lock-fixture.js'
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
