import test from 'node:test'
import assert from 'node:assert/strict'
import { dispatchPane } from './turn-queue-dispatch.js'
import { makeItem } from './turn-item.js'
import { input, reader, agent, pane } from './turn-fixture-data.test.js'
import { makeDeps } from './turn-fixture.test.js'
import type { Availability } from '../domain/timeline.js'

const reset = Date.now() + 80
const limited: Availability = {
  state: 'limited',
  source: 'codex',
  checkedAt: new Date().toISOString(),
  resetsAt: new Date(Date.now() + 60000).toISOString(),
  reason: 'rate_limit_reached',
  window: 'primary',
}
const near: Availability = { ...limited, resetsAt: new Date(reset).toISOString() }
const idle: Availability = {
  ...limited,
  state: 'unknown',
  resetsAt: null,
  reason: null,
  window: null,
  source: null,
}

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
  d.availability = { get: async () => (Date.now() < reset ? near : idle) }
  queue(d)
  await dispatchPane(d, 'w:p1')
  assert.equal(sent, '')
  await wait(() => sent === 'hi')
  assert.equal(sent, 'hi')
  assert.equal(d.queue.has('w:p1'), false)
})
