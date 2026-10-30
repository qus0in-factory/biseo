import assert from 'node:assert/strict'
import test from 'node:test'
import { createTurn } from './create-turn.js'
import { cancelTurn } from './turn-queue-cancel.js'
import { input, reader, agent } from './turn-data-fixture.js'
import { makeDeps } from './turn-fixture.js'

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
