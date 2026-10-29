import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
test('timeout releases the pane lock and late capture still completes',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=200
  let n=0
  await runTurn(s.d,item,{read:async()=>{
   n++
   if(n===1)return null
   await new Promise(r=>setTimeout(r,2))
   return'late'
  }},target)
  assert.equal(s.locks.has('w:p1'),false)
  assert.equal(s.store.get('r1')?.status,'timeout')
  await t.mock.timers.tick(2)
  await new Promise(r=>setImmediate(r))
  assert.equal(s.store.get('r1')?.status,'completed')
  assert.equal(s.store.get('r1')?.responseText,'late')
 }finally{t.mock.timers.reset()}
})
