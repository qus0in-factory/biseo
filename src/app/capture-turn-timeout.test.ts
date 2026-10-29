import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
test('timeout is shown then upgraded when a late response arrives',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']})
 try{
  const s=setup();s.d.timeoutMs=1;s.d.lateCaptureMs=200
  let n=0,ms:number[]=[]
  await captureTurn(s.d,item,{read:async(tt)=>{
   ms.push(tt);n++
   if(n===1)return null
   await new Promise(r=>setTimeout(r,5))
   return'late'
  }})
  assert.equal(s.store.get('r1')?.status,'timeout')
  assert.equal(s.store.get('r1')?.errorCode,'turn_timeout')
  assert.ok(ms.length===2&&ms[0]===1&&ms[1]>0&&ms[1]<=200,`first reads late=${ms}`)
  await t.mock.timers.tick(5)
  await new Promise(r=>setImmediate(r))
  assert.equal(s.store.get('r1')?.status,'completed')
  const got=s.store.get('r1')
  assert.equal(got?.responseText,'late')
  assert.equal(got?.errorCode,null)
  assert.ok(ms.length===2&&ms[1]>0&&ms[1]<=200,`late=${ms}`)
 }finally{t.mock.timers.reset()}
})