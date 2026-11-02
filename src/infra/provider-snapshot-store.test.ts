import assert from 'node:assert/strict'
import test from 'node:test'
import { clearProviderSnapshots, getProviderSnapshot, makeStaleUsage, setProviderSnapshot } from './provider-snapshot-store.js'

test('provider snapshot store saves and produces stale usage', () => {
  clearProviderSnapshots()
  const fresh = {
    provider: 'grok', state: 'available' as const,
    metrics: [{ id: 'm', label: 'M', unit: 'percent', used: 45, limit: 100, remaining: 55, resetsAt: '2026-11-05T00:00:00Z' }],
    windows: [{ window: 'm', usedPercent: 45, resetsAt: '2026-11-05T00:00:00Z', checkedAt: null, limitReached: false, source: 'grok' }],
  }
  setProviderSnapshot('grok', fresh)
  assert.equal(getProviderSnapshot('grok')?.provider, 'grok')

  const stale = makeStaleUsage('grok', getProviderSnapshot('grok'), 'auth_required')
  assert.equal(stale.state, 'available')
  assert.equal(stale.reason, 'auth_required')
  assert.equal(stale.metrics[0].used, 45)
  assert.equal(stale.windows[0].source, 'grok-stale')
})
