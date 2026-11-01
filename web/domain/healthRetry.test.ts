import assert from 'node:assert/strict'
import test from 'node:test'
import type { Health, HealthPort } from './auth.js'
import { loadHealth } from './healthRetry.js'

const port = (run: () => Promise<Health>): HealthPort => ({ getHealth: run })
const ok = { status: 'ok' }

test('a transient failure is retried before it can reach the header', async () => {
  let calls = 0
  const p = port(async () => {
    calls++
    if (calls === 1) throw new TypeError('fetch failed')
    return ok
  })
  assert.deepEqual(await loadHealth(p, new AbortController().signal, [0]), { status: 'ok', data: ok })
  assert.equal(calls, 2)
})

test('a failure is reported only after the configured retries run out', async () => {
  let calls = 0
  const p = port(async () => {
    calls++
    throw new TypeError('offline')
  })
  const signal = new AbortController().signal
  assert.equal((await loadHealth(p, signal, [0, 0])).status, 'failed')
  assert.equal(calls, 3)
})
