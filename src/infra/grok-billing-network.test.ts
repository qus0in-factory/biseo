import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchGrokUsage } from './grok-billing-fetch.js'

for (const error of [new TypeError('network'), new DOMException('', 'TimeoutError')]) {
  test(`billing ${error.name} is transient`, async t => {
    const fetch = t.mock.method(globalThis, 'fetch', async () => { throw error })
    const result = await fetchGrokUsage(new Date(), () => 'test')
    assert.equal(result.reason, 'temporarily_unavailable')
    assert.equal(fetch.mock.callCount(), 1)
  })
}

test('missing DB access never queries or refreshes', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('unexpected') })
  const result = await fetchGrokUsage(new Date(), () => null)
  assert.equal(result.reason, 'auth_required')
  assert.equal(fetch.mock.callCount(), 0)
})
