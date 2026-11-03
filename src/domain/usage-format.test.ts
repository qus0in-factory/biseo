import test from 'node:test'
import assert from 'node:assert/strict'
import { formatCodexWindows } from './usage-format.js'
import type { RateLimits } from './availability.js'

test('formatCodexWindows preserves both primary and secondary values', () => {
  const r: RateLimits = {
    reached: null, primary: '2026-10-30T00:00:00.000Z', secondary: '2026-11-05T00:00:00.000Z',
    primaryUsedPercent: 20, secondaryUsedPercent: 90, snapshotAt: '2026-10-29T21:00:00.000Z'
  }
  const u = formatCodexWindows(r, new Date('2026-10-29T20:00:00.000Z'))
  assert.equal(u.state, 'available')
  assert.equal(u.windows[0].usedPercent, 20)
  assert.equal(u.windows[1].usedPercent, 90)
})

test('formatCodexWindows handles missing values as null without estimates', () => {
  const r: RateLimits = {
    reached: null, primary: null, secondary: null,
    primaryUsedPercent: null, secondaryUsedPercent: null, snapshotAt: null
  }
  const u = formatCodexWindows(r, new Date())
  assert.equal(u.windows[0].usedPercent, null)
})
