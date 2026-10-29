import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-fixture-data.test.js'

const at = '2026-10-29T11:00:00.000Z'
const limited = {
  state: 'limited' as const,
  source: 'codex',
  checkedAt: '2026-10-29T10:00:00.000Z',
  resetsAt: at,
  reason: 'rate_limit_reached',
  window: 'primary' as const,
}

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

test('a stale available claim is demoted to unknown and never blocks', async () => {
  const s = await availabilitySummaries(
    [pane],
    [agent],
    new PaneLocks(),
    {
      ttlMs: 15 * 60 * 1000,
      get: async () => ({
        state: 'available' as const,
        source: 'codex',
        checkedAt: '2026-10-29T09:00:00.000Z',
        observedAt: '2026-10-29T10:00:00.000Z',
        resetsAt: null,
        reason: null,
        window: null,
      }),
    },
    new Date('2026-10-29T10:00:00.000Z'),
  )
  assert.equal(s[0].availability.state, 'unknown')
  assert.equal(s[0].availability.reason, 'stale_availability')
  assert.equal(s[0].sendable, true)
  assert.equal(s[0].disabledReason, null)
})

test('a fresh available claim is kept', async () => {
  const s = await availabilitySummaries(
    [pane],
    [agent],
    new PaneLocks(),
    {
      ttlMs: 15 * 60 * 1000,
      get: async () => ({
        state: 'available' as const,
        source: 'codex',
        checkedAt: '2026-10-29T09:58:00.000Z',
        observedAt: '2026-10-29T10:00:00.000Z',
        resetsAt: null,
        reason: null,
        window: null,
      }),
    },
    new Date('2026-10-29T10:00:00.000Z'),
  )
  assert.equal(s[0].availability.state, 'available')
})
