import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
import {deferred}from'../test-wait.test-util.js'
test('late read survives newer turn',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.lateCaptureMs=100
  const second={...item,requestId:'r2',seq:2};s.store.add(second)
  const started=deferred(),released=deferred(),closed=deferred()
  let n=0
  await captureTurn(s.d,item,{read:async()=>{if(++n===2){started.resolve();await released.promise}return null},close:closed.resolve})
  await started.promise
  await captureTurn(s.d,second,{read:async()=>'new'})
  released.resolve()
  t.mock.timers.tick(100)
  await closed.promise
  const old=s.store.get('r1'),current=s.store.get('r2')
  assert.equal(n,2)
  assert.deepEqual([old?.status,old?.errorCode,current?.status],['timeout','turn_timeout','completed'])
 }finally{t.mock.timers.reset()}
})
