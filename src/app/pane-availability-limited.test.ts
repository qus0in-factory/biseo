import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-fixture-data.test.js'
import { limited } from './pane-availability-fixture.test.js'

test('limited availability disables a pane and is carried in the summary', async () => {
  const s = await availabilitySummaries(
    [pane],
    [agent],
    new PaneLocks(),
    { get: async () => limited },
    new Date('2026-10-29T10:00:00.000Z'),
  )
  assert.equal(s[0].sendable, false)
  assert.equal(s[0].disabledReason, 'provider_rate_limited')
  assert.deepEqual(s[0].availability, limited)
})
