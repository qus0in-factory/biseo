import test from 'node:test'
import assert from 'node:assert/strict'
import { createTurn } from './create-turn.js'
import { runQueue } from './turn-queue-run.js'
import { makeDeps } from './turn-fixture.js'
import { agent, input, reader } from './turn-data-fixture.js'

test('queue dispatch cannot send while a done pane is still capturing', async () => {
  const d = makeDeps(reader)
  d.herdr.listAgents = async () => [{ ...agent, agent_status: 'done' }]
  d.locks.reserve(input.paneId, 'capturing')
  await createTurn(d, input)
  let calls = 0
  d.capture.begin = async () => { calls++; return reader }
  d.herdr.prompt = async () => { calls++ }
  await runQueue(d, input.paneId, () => {})
  assert.equal(calls, 0)
  assert.equal(d.queue.peek(input.paneId)?.requestId, input.requestId)
  assert.equal(d.store.get(input.requestId)?.status, 'queued')
})
