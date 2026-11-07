import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchGrokUsage } from './grok-billing-fetch.js'

test('response body timeout stays transient and logs only safe diagnostics', async t => {
  const log = t.mock.method(console, 'warn', () => {})
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: true, status: 200,
    json: async () => { throw new DOMException('private body', 'AbortError') }
  }) as Response)
  const result = await fetchGrokUsage(new Date(), () => 'private credential')
  assert.equal(result.reason, 'temporarily_unavailable')
  assert.deepEqual(JSON.parse(log.mock.calls[0].arguments[0]), {
    provider: 'grok', stage: 'json', status: 200, reason: 'temporarily_unavailable'
  })
})
