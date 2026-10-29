import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {dispatchPane}from'./turn-queue-dispatch.js'
import {input,reader,agent,pane}from'./turn-data-fixture.js'
import {makeDeps}from'./turn-fixture.js'
import {until as wait} from '../test-wait.test-util.js'
test('target_not_found waits for a transient pane loss',async()=>{
 const d=makeDeps(reader),w={...agent,agent_status:'working'}
 d.herdr.listAgents=async()=>[w];d.herdr.getAgent=async()=>w
 assert.ok((await createTurn(d,input)).ok)
 d.targetGraceMs=20
 d.herdr.listAgents=async()=>[agent];d.herdr.getAgent=async()=>agent
 d.herdr.getPane=async()=>undefined
 let got=''
 d.herdr.prompt=async(_p,t)=>{got=t}
 setTimeout(()=>{d.herdr.getPane=async()=>pane},5)
 await dispatchPane(d,'w:p1')
 await wait(()=>got==='hi')
 assert.equal(got,'hi')
})
