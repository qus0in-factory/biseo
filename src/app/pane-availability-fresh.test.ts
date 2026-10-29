import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-fixture-data.test.js'
import { availableClaim, fresh, ttl } from './pane-availability-fixture.test.js'

test('a fresh available claim is kept', async () => {
  const s = await availabilitySummaries(
    [pane],
    [agent],
    new PaneLocks(),
    { ttlMs: ttl, get: async () => availableClaim(fresh) },
    new Date('2026-10-29T10:00:00.000Z'),
  )
  assert.equal(s[0].availability.state, 'available')
})
