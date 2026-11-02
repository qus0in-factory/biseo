import test from 'node:test'
import assert from 'node:assert/strict'
import { createTurn } from './create-turn.js'
import { makeDeps } from './turn-fixture.js'
import { agent, pane, input, reader } from './turn-data-fixture.js'

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
