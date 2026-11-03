import assert from 'node:assert/strict'
import test from 'node:test'
import { ApiError } from './auth.js'
import type { Health } from './auth.js'
import type { HealthPort } from './auth.js'
import { loadHealth } from './healthRetry.js'
const port = (run: () => Promise<Health>): HealthPort => ({ getHealth: run })

test('an already aborted request never calls the health endpoint', async () => {
  let calls = 0
  const p = port(async () => {
    calls++
    throw new Error('unexpected')
  })
  const controller = new AbortController()
  controller.abort()
  assert.equal((await loadHealth(p, controller.signal, [0])).status, 'aborted')
  assert.equal(calls, 0)
})

test('an aborted retry wait stays silent', async () => {
  const controller = new AbortController()
  const p = port(async () => {
    throw new TypeError('offline')
  })
  const pending = loadHealth(p, controller.signal, [10])
  controller.abort()
  assert.equal((await pending).status, 'aborted')
})
test('an expired login is not retried', async () => {
  let calls = 0
  const p: HealthPort = {
    getHealth: async () => {
      calls++
      throw new ApiError('authFailed')
    },
  }
  const result = await loadHealth(p, new AbortController().signal, [0])
  assert.equal(result.status, 'auth')
  assert.equal(calls, 1)
})
{
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
}
