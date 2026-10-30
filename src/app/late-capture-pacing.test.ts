import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
test('immediate null late reader is paced and bounded',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=30
  let n=0
  await captureTurn(s.d,item,{read:async()=>{n++;return null}})
  assert.ok(n>=2)
  assert.equal(s.store.get('r1')?.status,'timeout')
  await t.mock.timers.tick(1000)
  await new Promise(r=>setImmediate(r))
  assert.ok(n>=2)
  assert.equal(s.store.get('r1')?.status,'timeout')
  assert.equal(s.store.get('r1')?.errorCode,'turn_timeout')
 }finally{t.mock.timers.reset()}
})
