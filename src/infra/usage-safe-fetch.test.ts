import assert from 'node:assert/strict'
import test from 'node:test'
import { safeFetch } from './usage-safe-fetch.js'
import { clearProviderSnapshots } from './provider-snapshot-store.js'

test('safeFetch caches and recovers', async () => {
  clearProviderSnapshots()
  const d = new Date()
  const m = [{ id: 'p', label: 'P', unit: 'percent', used: 30, limit: 100, remaining: 70, resetsAt: null }]
  const ok = { provider: 'cx', state: 'available' as const, metrics: m, windows: [] }
  const fail = { provider: 'cx', state: 'unknown' as const, metrics: [], windows: [], reason: 'auth_required' }
  assert.equal((await safeFetch('cx', async () => ok, d)).metrics[0].used, 30)
  const r2 = await safeFetch('cx', async () => fail, d)
  assert.equal(r2.reason, 'auth_required')
  assert.equal(r2.metrics[0].used, 30)
  const r3 = await safeFetch('cx', async () => ({ ...ok, metrics: [{ ...m[0], used: 35 }] }), d)
  assert.equal(r3.metrics[0].used, 35)
})
