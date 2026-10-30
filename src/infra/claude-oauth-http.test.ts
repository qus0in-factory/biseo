import test from 'node:test'
import assert from 'node:assert/strict'
import { claudeHttpUsage } from './claude-oauth-http.js'

const now = new Date('2026-10-30T10:00:00Z')

test('claude 429 keeps an honest unknown with the retry time', () => {
  const res = claudeHttpUsage(429, new Headers({ 'retry-after': '60' }), null, now)
  assert.equal(res.provider, 'claude')
  assert.equal(res.state, 'unknown')
  assert.equal(res.reason, 'rate_limited')
  assert.equal(res.retryAt, '2026-10-30T10:01:00.000Z')
  assert.deepEqual(res.metrics, [])
})
