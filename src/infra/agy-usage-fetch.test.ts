import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchAgyUsage } from './agy-usage-fetch.js'

test('fetchAgyUsage returns unknown state with retry timestamp and source reason', async () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const res = await fetchAgyUsage(now)
  assert.equal(res.provider, 'agy')
  assert.equal(res.state, 'unknown')
  assert.equal(res.windows.length, 1)
  assert.equal(res.windows[0].window, 'primary')
  assert.equal(res.windows[0].usedPercent, null)
  assert.equal(res.windows[0].source, 'agy-unauthenticated')
  assert.equal(res.windows[0].resetsAt, '2026-10-30T10:05:00.000Z')
})
