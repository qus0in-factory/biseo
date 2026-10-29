import test from'node:test'
import assert from'node:assert/strict'
import {createTurn}from'./create-turn.js'
import {cancelTurn}from'./turn-queue-cancel.js'
import {input,reader,agent}from'./turn-fixture-data.test.js'
import {makeDeps}from'./turn-fixture.test.js'
test('cancel is limited to queued turns',async()=>{
 const d=makeDeps(reader),work={...agent,agent_status:'working'}
 d.herdr.listAgents=async()=>[work]
 d.herdr.getAgent=async()=>work
 assert.ok((await createTurn(d,input)).ok)
 const c=cancelTurn(d,'r1')
 assert.ok(c.ok)
 assert.equal(d.store.get('r1')?.status,'cancelled')
 assert.ok(!d.queue.has('w:p1'))
 const a=cancelTurn(d,'r1')
 assert.ok(!a.ok&&a.status===409)
 d.herdr.listAgents=async()=>[agent]
 d.herdr.getAgent=async()=>agent
 assert.ok((await createTurn(d,{...input,requestId:'r2'})).ok)
 const w=cancelTurn(d,'r2')
 assert.ok(!w.ok&&w.error==='not_cancellable')
 const m=cancelTurn(d,'none')
 assert.ok(!m.ok&&m.status===404)
})
