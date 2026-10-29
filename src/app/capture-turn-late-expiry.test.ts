import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
test('late capture expires to failed late_capture_expired',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=200
  let n=0
  await captureTurn(s.d,item,{read:async()=>{n++;return null}})
  await t.mock.timers.tick(300)
  await new Promise(r=>setImmediate(r))
  assert.ok(n>=2)
  assert.equal(s.store.get('r1')?.status,'failed')
  assert.equal(s.store.get('r1')?.errorCode,'late_capture_expired')
 }finally{t.mock.timers.reset()}
})
