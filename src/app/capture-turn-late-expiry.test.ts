import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
test('late capture keeps timeout when no response arrives',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=200
  let n=0
  await captureTurn(s.d,item,{read:async()=>{n++;return null}})
  assert.ok(n>=2)
  assert.equal(s.store.get('r1')?.status,'timeout')
 }finally{t.mock.timers.reset()}
})
