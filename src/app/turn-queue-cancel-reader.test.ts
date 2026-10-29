import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {cancelTurn}from'./turn-queue-cancel.js'
import {dispatchPane}from'./turn-queue-dispatch.js'
import {input,reader,agent}from'./turn-fixture-data.test.js'
import {makeDeps}from'./turn-fixture.test.js'
const wait=async(f:()=>boolean)=>{for(let i=0;i<100&&!f();i++)await new Promise(r=>setTimeout(r,1))}
test('cancel in prepare closes the reader',async()=>{
 const d=makeDeps(reader),work={...agent,agent_status:'working'}
 d.herdr.listAgents=async()=>[work]
 d.herdr.getAgent=async()=>work
 assert.ok((await createTurn(d,input)).ok)
 d.herdr.listAgents=async()=>[agent]
 d.herdr.getAgent=async()=>agent
 let closed=0
 d.capture.begin=async()=>{
  cancelTurn(d,'r1')
  return{read:async()=>null,close:()=>{closed++}}
 }
 d.herdr.prompt=async()=>{throw new Error('prompt')}
 await dispatchPane(d,'w:p1')
 await wait(()=>closed===1)
 assert.equal(closed,1)
 assert.equal(d.store.get('r1')?.status,'cancelled')
})
