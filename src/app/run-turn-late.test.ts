import test from'node:test'
import assert from'node:assert/strict'
import {runTurn}from'./run-turn.js'
import {item,target}from'./run-fixture-data.test.js'
import {setup}from'./run-fixture.test.js'
const until=async(f:()=>boolean)=>{for(let i=0;i<50&&!f();i++)await new Promise(r=>setTimeout(r,1))}
test('timeout releases the pane lock and late capture still completes',async()=>{
 const s=setup()
 s.d.timeoutMs=1;s.d.lateCaptureMs=10
 let n=0
 await runTurn(s.d,item,{read:async()=>{
  n++
  if(n===1)return null
  await new Promise(r=>setTimeout(r,2))
  return'late'
 }},target)
 assert.equal(s.locks.has('w:p1'),false)
 assert.equal(s.store.get('r1')?.status,'timeout')
 await until(()=>s.store.get('r1')?.status==='completed')
 assert.equal(s.store.get('r1')?.responseText,'late')
})
