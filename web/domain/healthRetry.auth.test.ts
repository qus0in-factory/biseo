import assert from 'node:assert/strict'
import test from 'node:test'
import { ApiError, type Health, type HealthPort } from './auth.js'
import { loadHealth } from './healthRetry.js'

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
