import test from 'node:test'
import assert from 'node:assert/strict'
import { toProviderUsage } from '../domain/usage-format.js'
import { UsageCollector } from '../infra/usage-collector.js'
import type { Availability } from '../domain/timeline.js'
import type { AvailabilityPort } from '../app/ports.js'

test('toProviderUsage formats availability correctly', () => {
  const avail: Availability = {
    state: 'limited',
    source: 'codex',
    checkedAt: '2026-10-29T21:00:00.000Z',
    observedAt: '2026-10-29T21:00:00.000Z',
    resetsAt: '2026-10-30T02:00:00.000Z',
    reason: 'rate_limit_reached',
    window: 'primary',
  }
  const u = toProviderUsage('codex', avail)
  assert.equal(u.provider, 'codex')
  assert.equal(u.state, 'limited')
  assert.equal(u.limitReached, true)
  assert.equal(u.resetsAt, '2026-10-30T02:00:00.000Z')
})

test('UsageCollector caches last successful report on failure', async () => {
  let fail = false
  const availPort: AvailabilityPort = {
    get: async () => {
      if (fail) throw new Error('availability error')
      return {
        state: 'available',
        source: 'codex',
        checkedAt: '2026-10-29T20:00:00.000Z',
        observedAt: '2026-10-29T20:00:00.000Z',
        resetsAt: null,
        reason: null,
        window: null,
      }
    },
  }
  const collector = new UsageCollector(availPort)
  const r1 = await collector.getReport()
  assert.equal(r1.providers[0].state, 'available')

  fail = true
  const r2 = await collector.getReport()
  assert.equal(r2.providers[0].state, 'available')
  assert.deepEqual(r2, r1)
})
