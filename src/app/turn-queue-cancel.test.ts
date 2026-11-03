import test from 'node:test'
import assert from 'node:assert/strict'
import { createTurn } from './create-turn.js'
import { cancelTurn } from './turn-queue-cancel.js'
import { dispatchPane } from './turn-queue-dispatch.js'
import { input, reader, agent } from './turn-data-fixture.js'
import { makeDeps } from './turn-fixture.js'
import { until as wait } from '../test-wait.test-util.js'

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
test('cancelling one queued turn preserves FIFO order of the rest', async () => {
  const d = makeDeps(reader), work = { ...agent, agent_status: 'working' }
  d.herdr.listAgents = async () => [work]
  d.herdr.getAgent = async () => work
  for (const id of ['r1', 'r2', 'r3']) await createTurn(d, { ...input, requestId: id })
  assert.equal(d.queue.peek('w:p1')?.requestId, 'r1')
  assert.ok(cancelTurn(d, 'r2').ok)
  assert.equal(d.queue.shift('w:p1')?.requestId, 'r1')
  assert.equal(d.queue.shift('w:p1')?.requestId, 'r3')
})
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
