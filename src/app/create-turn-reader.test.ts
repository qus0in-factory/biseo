import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {input,reader,agent}from'./turn-data-fixture.js'
import {makeDeps}from'./turn-fixture.js'
const spy=()=>{const d=makeDeps(reader);let n=0;d.capture.begin=async()=>{n++;return reader};return{d,n:()=>n}}
test('busy agent and queued pane do not open a reader',async()=>{
 const a=spy(),w={...agent,agent_status:'working'}
 a.d.herdr.listAgents=async()=>[w];a.d.herdr.getAgent=async()=>w
 await createTurn(a.d,input)
 assert.equal(a.n(),0)
 a.d.locks.reserve('w:p1','other')
 a.d.herdr.listAgents=async()=>[agent];a.d.herdr.getAgent=async()=>agent
 await createTurn(a.d,{...input,requestId:'r2'})
 assert.equal(a.n(),0)
 const b=spy()
 b.d.locks.reserve('w:p1','other')
 await createTurn(b.d,input)
 assert.equal(b.n(),0)
})
test('idle send opens exactly one reader',async()=>{
 const a=spy()
 const r=await createTurn(a.d,input)
 assert.equal(a.n(),1)
 if(r.ok)assert.equal(r.reader,reader)
})
