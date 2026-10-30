import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-data-fixture.js'

test('blocked screens are distinguished without storing or returning raw lines', async () => {
  const blocked = { ...agent, agent_status: 'blocked' as const }
  const raw = '5h limit reached for private-account'
  const s = await availabilitySummaries(
    [{ ...pane, agent_status: 'blocked' }],
    [blocked],
    new PaneLocks(),
    undefined,
    new Date('2026-10-29T10:00:00.000Z'),
    { classify: async () => raw.includes('5h limit') },
  )
  assert.equal(s[0].blockedReason, 'usage_limit')
  assert.equal(s[0].disabledReason, 'agent_blocked')
  assert.equal(JSON.stringify(s).includes(raw), false)
})
