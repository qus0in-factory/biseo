import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from './app.js'
import { makeDeps } from '../app/turn-fixture.test.js'
import { input, reader } from '../app/turn-fixture-data.test.js'

const resetsAt = new Date(Date.now() + 60000).toISOString()

test('POST returns the provider limit reason and reset time', async () => {
  const d = makeDeps(reader)
  d.availability = {
    get: async () => ({
      state: 'limited',
      source: 'codex',
      checkedAt: new Date().toISOString(),
      resetsAt,
      reason: 'rate_limit_reached',
      window: 'primary',
    }),
  }
  const app = createApp({
    ...d,
    verify: async () => {},
    healthStatus: 'ok',
    timeoutMs: 1000,
    graceMs: 0,
  })
  const r = await app.request('/herdr/turns', {
    method: 'POST',
    headers: {
      authorization: 'Bearer x',
      'content-type': 'application/json',
    },
    body: JSON.stringify(input),
  })
  assert.equal(r.status, 409)
  assert.deepEqual(await r.json(), {
    error: 'target_not_ready',
    reason: 'provider_rate_limited',
    resetsAt,
  })
  assert.equal(d.store.get('r1'), undefined)
})
