import test from 'node:test'
import assert from 'node:assert/strict'
import { createTurn } from './create-turn.js'
import { agent, pane, input, reader } from './test-util/turn-data-fixture.js'
import { makeDeps } from './test-util/turn-fixture.js'
import { limited, resetsAt } from './test-util/create-turn-availability-fixture.js'

{

test('a limited provider rejects send before capture and lock', async () => {
  const d = makeDeps(reader)
  let begins = 0
  d.capture.begin = async () => {
    begins++
    return reader
  }
  d.availability = { get: async () => limited }
  const r = await createTurn(d, input)
  assert.equal(r.ok, false)
  if (!r.ok) {
    assert.equal(r.status, 409)
    assert.equal(r.reason, 'provider_rate_limited')
    assert.equal(r.resetsAt, resetsAt)
  }
  assert.equal(begins, 0)
  assert.equal(d.locks.has('w:p1'), false)
  assert.equal(d.store.get('r1'), undefined)
})
}
{

test('unknown availability does not block a send', async () => {
  const d = makeDeps(reader)
  d.availability = {
    get: async () => ({
      ...limited,
      state: 'unknown',
      resetsAt: null,
      reason: null,
      window: null,
      source: null,
    }),
  }
  const r = await createTurn(d, input)
  assert.equal(r.ok, true)
  if (r.ok) assert.equal(r.reader, reader)
})
}
{
test('payload mismatch is rejected and a busy pane is queued',async()=>{
 const d=makeDeps(reader)
 await createTurn(d,input)
 const bad=await createTurn(d,{...input,text:'other'})
 assert.equal(bad.ok,false)
 if(!bad.ok)assert.equal(bad.reason,'request_id_payload_mismatch')
 d.locks.reserve('w:p1','other')
 const busy=await createTurn(d,{...input,requestId:'r2'})
 assert.equal(busy.ok,true)
 if(busy.ok){assert.equal(busy.item.status,'queued');assert.equal(busy.reader,null)}
 assert.equal(d.locks.has('w:p1'),true)
})
}
{

test('done during capture queues input without starting another reader or prompt', async () => {
  const d = makeDeps(reader)
  d.herdr.listAgents = async () => [{ ...agent, agent_status: 'done' }]
  d.herdr.listPanes = async () => [{ ...pane, agent_status: 'done' }]
  d.locks.reserve(input.paneId, 'capturing')
  let calls = 0
  d.capture.begin = async () => { calls++; return reader }
  d.herdr.prompt = async () => { calls++ }
  const result = await createTurn(d, input)
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.item.status, 'queued')
    assert.equal(result.reader, null)
  }
  assert.equal(calls, 0)
  assert.equal(d.locks.has(input.paneId), true)
})
}
