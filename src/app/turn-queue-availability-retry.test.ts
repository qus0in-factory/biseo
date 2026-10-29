import test from 'node:test'
import assert from 'node:assert/strict'
import { dispatchPane } from './turn-queue-dispatch.js'
import { hasRetry } from './availability-retry.js'
import { reader } from './turn-data-fixture.js'
import { makeDeps } from './turn-fixture.js'
import { idle, near, queue, wait } from './turn-queue-availability-fixture.js'

test('repeated limited dispatches keep one timer and success clears it', async () => {
  const d = makeDeps(reader)
  let sent = 0
  d.herdr.prompt = async () => {
    sent++
  }
  d.availability = { get: async () => near(60000) }
  queue(d)
  await dispatchPane(d, 'w:p1')
  await dispatchPane(d, 'w:p1')
  assert.equal(hasRetry('w:p1'), true)
  d.availability = { get: async () => idle }
  await dispatchPane(d, 'w:p1')
  assert.equal(hasRetry('w:p1'), false)
  await wait(() => sent === 1)
  assert.equal(sent, 1)
  await new Promise((r) => setTimeout(r, 150))
  assert.equal(sent, 1)
})
