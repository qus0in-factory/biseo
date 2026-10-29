import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-fixture-data.test.js'
import { limited, screen } from './pane-blocked-availability-fixture.test.js'

test('confirmed usage limits set usage_limited and keep the provider reason', async () => {
  const s = await availabilitySummaries(
    [pane],
    [agent],
    new PaneLocks(),
    { get: async () => limited },
    new Date('2026-10-29T10:00:00.000Z'),
    screen(false),
  )
  assert.equal(s[0].blockedReason, 'usage_limited')
  assert.equal(s[0].disabledReason, 'provider_rate_limited')
  assert.equal(s[0].sendable, false)
})
