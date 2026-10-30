import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchAgyUsage } from './agy-usage-fetch.js'

test('fetchAgyUsage parses live token or falls back to unknown', async () => {
  const now = new Date('2026-10-30T10:00:00Z')
  const res = await fetchAgyUsage(now)
  assert.equal(res.provider, 'agy')
  assert.ok(['available', 'limited', 'unknown'].includes(res.state))
})
