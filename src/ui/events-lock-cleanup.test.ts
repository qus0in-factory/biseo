import test from'node:test'
import assert from'node:assert/strict'
import {Hono}from'hono'
import {runSse}from'./events-sse.js'
import {Wake}from'./wake.js'
import {lockDeps,readEvent,TrackedLocks}from'./events-lock-fixture.js'
test('closing SSE removes its lock subscription',async()=>{
 const l=new TrackedLocks(),app=new Hono()
 app.get('/e',c=>runSse(c,lockDeps(l) as never,'w',()=>{},new Wake()))
 const r=await app.request('/e')
 await readEvent(r.body!,/pane\.updated/)
 await r.body?.cancel()
 const t0=Date.now()
 while(l.off!==1&&Date.now()-t0<2000)await new Promise(x=>setTimeout(x,10))
 assert.equal(l.off,1)
})
