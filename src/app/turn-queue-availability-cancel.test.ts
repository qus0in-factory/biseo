import test from 'node:test'
import assert from 'node:assert/strict'
import { dispatchPane } from './turn-queue-dispatch.js'
import { cancelTurn } from './turn-queue-cancel.js'
import { hasRetry } from './availability-retry.js'
import { reader } from './turn-data-fixture.js'
import { makeDeps } from './turn-fixture.js'
import { near, queue } from './turn-queue-availability-fixture.js'

test('cancel and an empty queue clear the pending retry', async () => {
  const d = makeDeps(reader)
  let sent = 0
  d.herdr.prompt = async () => {
    sent++
  }
  d.availability = { get: async () => near(60000) }
  queue(d)
  await dispatchPane(d, 'w:p1')
  assert.equal(hasRetry('w:p1'), true)
  assert.equal(cancelTurn(d, 'r1').ok, true)
  assert.equal(hasRetry('w:p1'), false)
  await dispatchPane(d, 'w:p1')
  assert.equal(sent, 0)
})
