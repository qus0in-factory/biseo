import test from 'node:test'
import assert from 'node:assert/strict'
import { resolvePaneAvailability } from './pane-availability-resolve.js'
import { makeTestPane } from './pane-usage-test-helper.js'
import type { Availability } from './timeline.js'

const u: Availability = {
  state: 'unknown', source: null, checkedAt: null, resetsAt: null, reason: null, window: null,
}

test('connected usage resolves unknown availability to available or limited', () => {
  const p = { ...makeTestPane('claude', 'opus'), availability: u }
  const w = (usedPercent: number, limitReached: boolean) => ({
    window: '5h', usedPercent, resetsAt: '2026-11-02T19:00:00Z', checkedAt: null, limitReached, source: 'claude',
  })
  assert.equal(resolvePaneAvailability(p, [{ provider: 'claude', state: 'available', windows: [w(43, false)] }])?.state, 'available')
  assert.equal(resolvePaneAvailability(p, [{ provider: 'claude', state: 'limited', windows: [w(100, true)] }])?.state, 'limited')
})
