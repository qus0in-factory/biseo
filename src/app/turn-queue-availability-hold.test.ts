import test from 'node:test'
import assert from 'node:assert/strict'
import { dispatchPane } from './turn-queue-dispatch.js'
import { reader } from './turn-data-fixture.js'
import { makeDeps } from './turn-fixture.js'
import { limited, queue } from './turn-queue-availability-fixture.js'

test('limited providers hold queued turns without sending', async () => {
  const d = makeDeps(reader)
  let sent = ''
  d.herdr.prompt = async (_p, t) => {
    sent = t
  }
  d.availability = { get: async () => limited }
  queue(d)
  await dispatchPane(d, 'w:p1')
  assert.equal(sent, '')
  assert.equal(d.queue.has('w:p1'), true)
  assert.equal(d.locks.has('w:p1'), false)
})
