import test from 'node:test'
import assert from 'node:assert/strict'
import { dispatchPane } from './turn-queue-dispatch.js'
import { reader } from './turn-data-fixture.js'
import { makeDeps } from './turn-fixture.js'
import { idle, limited, queue, wait } from './turn-queue-availability-fixture.js'

test('queued turns dispatch after the reset time', async () => {
  const d = makeDeps(reader)
  let sent = ''
  d.herdr.prompt = async (_p, t) => {
    sent = t
  }
  const reset = Date.now() + 20
  const nearAt = { ...limited, resetsAt: new Date(reset).toISOString() }
  d.availability = { get: async () => (Date.now() < reset ? nearAt : idle) }
  queue(d)
  await dispatchPane(d, 'w:p1')
  assert.equal(sent, '')
  await wait(() => sent === 'hi')
  assert.equal(sent, 'hi')
  assert.equal(d.queue.has('w:p1'), false)
})
