import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-data-fixture.js'
import { screen } from './pane-blocked-availability-fixture.js'

test('blocked screens without a marker are awaiting_input and failures fall back', async () => {
  const blocked = { ...agent, agent_status: 'blocked' as const }
  const base = [{ ...pane, agent_status: 'blocked' as const }]
  const a = await availabilitySummaries(base, [blocked], new PaneLocks(), undefined, new Date(), screen(false))
  assert.equal(a[0].blockedReason, 'awaiting_input')
  const b = await availabilitySummaries(base, [blocked], new PaneLocks(), undefined, new Date(), {
    classify: async () => Promise.reject(new Error('screen failed')),
  })
  assert.equal(b[0].blockedReason, 'awaiting_input')
})
