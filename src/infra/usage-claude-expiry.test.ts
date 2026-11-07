import test from 'node:test'
import assert from 'node:assert/strict'
import { safeFetch } from './usage-safe-fetch.js'
import { setProviderSnapshot } from './provider-snapshot-store.js'
import { good } from './test-util/claude-cache-fixture.test-util.js'
import { unknownUsage } from '../domain/usage-unknown.js'

test('safeFetch does not resurrect a Claude value rejected by the reset policy', async () => {
  setProviderSnapshot('claude', good)
  const fresh = unknownUsage('claude', 'auth_required')
  const r = await safeFetch('claude', async () => fresh, new Date())
  assert.equal(r, fresh)
  setProviderSnapshot('claude', null)
})
