import test from 'node:test'
import assert from 'node:assert/strict'
import { makeDeps } from '../app/turn-fixture.test.js'
import { input, reader } from '../app/turn-fixture-data.test.js'
import { appWith, limitedAvailability, resetsAt } from './post-turn-availability-fixture.js'

test('POST returns the provider limit reason and reset time', async () => {
  const d = makeDeps(reader)
  d.availability = limitedAvailability
  const app = appWith(d)
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
