import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-data-fixture.js'
import {setup}from'./run-fixture.js'
import { wait, deferred } from '../test-wait.test-util.js'

{
test('a new turn on the same pane does not abort previous late capture',async()=>{
 const s=setup()
 s.d.timeoutMs=1;s.d.lateCaptureMs=100
 const second={...item,requestId:'r2',seq:2}
 s.store.add(second)
 let first=true,release:()=>void=()=>{}
 const gate=new Promise<void>(r=>{release=r})
 const oldReader={read:async()=>{
  if(first){first=false;return null}
  await gate
  return'old'
 }}
 await captureTurn(s.d,item,oldReader)
 assert.equal(s.store.get('r1')?.status,'timeout')
 await captureTurn(s.d,second,{read:async()=>'new'})
 release()
 await wait(10)
 assert.equal(s.store.get('r1')?.status,'completed')
 assert.equal(s.store.get('r1')?.responseText,'old')
 assert.equal(s.store.get('r2')?.status,'completed')
})
}
{
test('late capture read errors transition to capture_unavailable',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=200
  let n=0
  await captureTurn(s.d,item,{read:async()=>{
   if(++n===1)return null
   throw new Error('late read')
  }})
  await new Promise(r=>setImmediate(r))
  assert.equal(n,2)
  assert.equal(s.store.get('r1')?.status,'capture_unavailable')
  assert.equal(s.store.get('r1')?.errorCode,'response_capture_unavailable')
 }finally{t.mock.timers.reset()}
})
}
{
test('late read survives newer turn',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.lateCaptureMs=100
  const second={...item,requestId:'r2',seq:2};s.store.add(second)
  const started=deferred(),released=deferred(),cl=deferred()
  let n=0
  await captureTurn(s.d,item,{read:async()=>{if(++n===2){started.resolve();await released.promise}return null},close:cl.resolve})
  await started.promise
  await captureTurn(s.d,second,{read:async()=>'new'})
  released.resolve()
  t.mock.timers.tick(100)
  await cl.promise
  const old=s.store.get('r1'),current=s.store.get('r2')
  assert.equal(n,2)
  assert.deepEqual([old?.status,old?.errorCode,current?.status],['timeout','late_capture_expired','completed'])
 }finally{t.mock.timers.reset()}
})
}
{
test('immediate null late reader is paced and bounded',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=30
  let n=0
  await captureTurn(s.d,item,{read:async()=>{n++;return null}})
  assert.equal(n,2)
  assert.equal(s.store.get('r1')?.status,'timeout')
  await t.mock.timers.tick(1000)
  await new Promise(r=>setImmediate(r))
  assert.equal(n,2)
  assert.equal(s.store.get('r1')?.status,'timeout')
  assert.equal(s.store.get('r1')?.errorCode,'late_capture_expired')
 }finally{t.mock.timers.reset()}
})
}
