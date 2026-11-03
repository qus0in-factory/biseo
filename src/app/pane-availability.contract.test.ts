import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-data-fixture.js'
import { limited, screen } from './pane-blocked-availability-fixture.js'

{
test('blocked input markers classify as input_request', async () => {
 const blocked={...agent,agent_status:'blocked' as const}
 const base=[{...pane,agent_status:'blocked' as const}]
 const s=await availabilitySummaries(base,[blocked],new PaneLocks(),undefined,new Date(),undefined,{classify:async()=>true})
 assert.equal(s[0].blockedReason,'input_request')
 assert.equal(s[0].disabledReason,'agent_blocked')
})
}
{

test('confirmed usage limits set usage_limited and keep the provider reason', async () => {
  const s = await availabilitySummaries(
    [pane],
    [agent],
    new PaneLocks(),
    { get: async () => limited },
    new Date('2026-10-29T10:00:00.000Z'),
    screen(false),
  )
  assert.equal(s[0].blockedReason, 'usage_limit')
  assert.equal(s[0].disabledReason, 'provider_rate_limited')
  assert.equal(s[0].sendable, false)
})
}
{

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
  assert.equal(s[0].usageLimitSuspected, true)
  assert.equal(s[0].disabledReason, 'agent_blocked')
  assert.equal(JSON.stringify(s).includes(raw), false)
})
}
