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
const screen = (ok: boolean) => ({ classify: async () => ok })

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
  assert.equal(s[0].blockedReason, 'suspected_limit')
  assert.equal(s[0].disabledReason, 'agent_blocked')
  assert.equal(JSON.stringify(s).includes(raw), false)
})

test('blocked screens without a marker are awaiting_input and failures fall back', async () => {
  const blocked = { ...agent, agent_status: 'blocked' as const }
  const base = [{ ...pane, agent_status: 'blocked' }]
  const a = await availabilitySummaries(base, [blocked], new PaneLocks(), undefined, new Date(), screen(false))
  assert.equal(a[0].blockedReason, 'awaiting_input')
  const b = await availabilitySummaries(base, [blocked], new PaneLocks(), undefined, new Date(), {
    classify: async () => Promise.reject(new Error('screen failed')),
  })
  assert.equal(b[0].blockedReason, 'awaiting_input')
})
