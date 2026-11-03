import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-data-fixture.js'
import { availableClaim, fresh, ttl } from './test-util/pane-availability-fixture.js'
import { limited } from './test-util/pane-availability-fixture.js'
import { availableClaim, old, ttl } from './test-util/pane-availability-fixture.js'
import { screen } from './pane-blocked-availability-fixture.js'

{

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
}
{

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
}
{

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
}
{

test('unknown or failing availability keeps execution gating intact', async () => {
  const s = await availabilitySummaries(
    [pane],
    [agent],
    new PaneLocks(),
    { get: async () => Promise.reject(new Error('read failed')) },
  )
  assert.equal(s[0].sendable, true)
  assert.equal(s[0].disabledReason, null)
  assert.equal(s[0].availability.state, 'unknown')
})
}
{

test('blocked screens without a marker are awaiting_input and failures fall back', async () => {
  const blocked = { ...agent, agent_status: 'blocked' as const }
  const base = [{ ...pane, agent_status: 'blocked' as const }]
  const a = await availabilitySummaries(base, [blocked], new PaneLocks(), undefined, new Date(), screen(false))
  assert.equal(a[0].blockedReason, 'unknown')
  const b = await availabilitySummaries(base, [blocked], new PaneLocks(), undefined, new Date(), {
    classify: async () => Promise.reject(new Error('screen failed')),
  })
  assert.equal(b[0].blockedReason, 'unknown')
})
}
