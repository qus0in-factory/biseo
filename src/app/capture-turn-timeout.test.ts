import test from'node:test'
import assert from'node:assert/strict'
import {captureTurn}from'./capture-turn.js'
import {item}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
const until=async(f:()=>boolean)=>{for(let i=0;i<50&&!f();i++)await new Promise(r=>setTimeout(r,1))}
test('timeout is shown then upgraded when a late response arrives',async()=>{
 const s=setup()
 s.d.timeoutMs=1;s.d.lateCaptureMs=10
 let n=0,ms:number[]=[]
 await captureTurn(s.d,item,{read:async(t)=>{
  ms.push(t);n++
  if(n===1)return null
  await new Promise(r=>setTimeout(r,5))
  return'late'
 }})
 assert.equal(s.store.get('r1')?.status,'timeout')
 assert.equal(s.store.get('r1')?.errorCode,'turn_timeout')
 await until(()=>s.store.get('r1')?.status==='completed')
 const got=s.store.get('r1')
 assert.equal(got?.responseText,'late')
 assert.equal(got?.errorCode,null)
 assert.deepEqual(ms,[1,10])
})
