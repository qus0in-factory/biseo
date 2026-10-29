import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-data-fixture.js'

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
