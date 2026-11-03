import test from 'node:test'
import assert from 'node:assert/strict'
import { availabilitySummaries } from './pane-availability.js'
import { PaneLocks } from './pane-locks.js'
import { agent, pane } from './turn-data-fixture.js'
import { availableClaim, fresh, old, ttl, limited } from './test-util/pane-availability-fixture.js'
import { limited as blockedLimited, screen } from './pane-blocked-availability-fixture.js'

test('blocked input markers classify as input_request', async () => {
 const blocked={...agent,agent_status:'blocked' as const}
 const base=[{...pane,agent_status:'blocked' as const}]
 const s=await availabilitySummaries(base,[blocked],new PaneLocks(),undefined,new Date(),undefined,{classify:async()=>true})
 assert.equal(s[0].blockedReason,'input_request')
 assert.equal(s[0].disabledReason,'agent_blocked')
})
{
const limited = blockedLimited
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
