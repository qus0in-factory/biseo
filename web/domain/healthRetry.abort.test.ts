import assert from 'node:assert/strict'
import test from 'node:test'
import { ApiError, type Health, type HealthPort } from './auth.js'
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
