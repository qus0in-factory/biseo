import test from 'node:test'
import assert from 'node:assert/strict'
import { dispatchPane } from './turn-queue-dispatch.js'
import { cancelTurn } from './turn-queue-cancel.js'
import { hasRetry } from './availability-retry.js'
import { makeItem } from './turn-item.js'
import { input, reader, agent, pane } from './turn-data-fixture.js'
import { makeDeps } from './turn-fixture.js'
import type { Availability } from '../domain/timeline.js'

const limited: Availability = {
  state: 'limited',
  source: 'codex',
  checkedAt: new Date().toISOString(),
  resetsAt: new Date(Date.now() + 60000).toISOString(),
  reason: 'rate_limit_reached',
  window: 'primary',
}
const idle: Availability = {
  ...limited,
  state: 'unknown',
  resetsAt: null,
  reason: null,
  window: null,
  source: null,
}
const near = (ms: number): Availability => ({
  ...limited,
  resetsAt: new Date(Date.now() + ms).toISOString(),
})

function queue(d: ReturnType<typeof makeDeps>) {
  const i = makeItem(input, { pane, agent }, d.store.next())
  d.store.add(i)
  d.queue.add(i)
}

const wait = async (f: () => boolean) => {
  for (let n = 0; n < 100 && !f(); n++) await new Promise((r) => setTimeout(r, 5))
}

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
