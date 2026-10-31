import assert from 'node:assert/strict'
import test from 'node:test'
import { createD1PinAttempts } from '../infra/d1-pin-attempts.js'
import { createFakeD1 } from './fake-d1.js'

test('PIN failure window and lock are measured in seconds', async () => {
  const store = createD1PinAttempts(createFakeD1())
  const limits = { max: 2, windowSeconds: 900, lockSeconds: 900 }
  const start = 1_000_000
  assert.equal(await store.fail('ip', limits, start), false)
  assert.equal(await store.fail('ip', limits, start + 10_000), true)
  assert.equal(await store.locked('ip', start + 899_999), true)
  assert.equal(await store.locked('ip', start + 910_000), false)
})
