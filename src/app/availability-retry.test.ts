import test from 'node:test'
import assert from 'node:assert/strict'
import {
  clearRetry,
  hasRetry,
  retryAt,
} from './availability-retry.js'
import type { Availability } from '../domain/timeline.js'

const soon = (ms: number): Availability => ({
  state: 'limited',
  source: 'codex',
  checkedAt: new Date().toISOString(),
  resetsAt: new Date(Date.now() + ms).toISOString(),
  reason: 'rate_limit_reached',
  window: 'primary',
})

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

test('one retry timer per pane and clear cancels it', async () => {
  let runs = 0
  const a = soon(20)
  retryAt('p1', a, () => runs++)
  retryAt('p1', a, () => runs++)
  assert.equal(hasRetry('p1'), true)
  clearRetry('p1')
  assert.equal(hasRetry('p1'), false)
  await wait(250)
  assert.equal(runs, 0)
})

test('duplicate scheduling dispatches only once', async () => {
  let runs = 0
  const a = soon(20)
  retryAt('p2', a, () => runs++)
  retryAt('p2', a, () => runs++)
  await wait(300)
  assert.equal(runs, 1)
  assert.equal(hasRetry('p2'), false)
})
