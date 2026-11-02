import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluatePaneUsageWarning } from './pane-usage-warning.js'
import type { PaneSummary } from './timeline.js'
import type { UsageProvider } from './usage.js'

test('pane warning does not fire for stale auth-required provider', () => {
  const pane: PaneSummary = {
    paneId: 'p1', tabId: 't1', name: 'Grok Pane', agentKind: 'grok', status: 'idle',
    sendable: true, disabledReason: null,
  }
  const stale: UsageProvider = {
    provider: 'grok', state: 'available', reason: 'auth_required',
    windows: [{ window: 'm', usedPercent: 99, resetsAt: null, checkedAt: null, limitReached: true, source: 'grok-stale' }],
  }
  const result = evaluatePaneUsageWarning(pane, [stale])
  assert.equal(result.hasWarning, false)
  assert.equal(result.isUnknown, true)
})
