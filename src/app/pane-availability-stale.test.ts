import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-data-fixture.js'
import { availableClaim, old, ttl } from './pane-availability-fixture.test.js'

test('a stale available claim is demoted to unknown and never blocks', async () => {
  const s = await availabilitySummaries(
    [pane],
    [agent],
    new PaneLocks(),
    { ttlMs: ttl, get: async () => availableClaim(old) },
    new Date('2026-10-29T10:00:00.000Z'),
  )
  assert.equal(s[0].availability.state, 'unknown')
  assert.equal(s[0].availability.reason, 'stale_availability')
  assert.equal(s[0].sendable, true)
  assert.equal(s[0].disabledReason, null)
})
