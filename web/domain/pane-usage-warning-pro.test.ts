import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluatePaneUsageWarning } from './pane-usage-warning.js'
import { makeTestPane } from './pane-usage-test-helper.js'

test('codex pro warns on weekly threshold and is not unknown below it', () => {
  const pane = makeTestPane('codex', 'sol')
  const healthy = [{
    provider: 'codex', state: 'available' as const,
    windows: [{ window: 'w', usedPercent: 40, resetsAt: null, checkedAt: null, limitReached: false, source: 'codex' }]
  }]
  const ok = evaluatePaneUsageWarning(pane, healthy)
  assert.equal(ok.isUnknown, false)
  assert.equal(ok.hasWarning, false)

  const exceeded = [{
    provider: 'codex', state: 'available' as const,
    windows: [{ window: 'w', usedPercent: 99, resetsAt: null, checkedAt: null, limitReached: false, source: 'codex' }]
  }]
  const warn = evaluatePaneUsageWarning(pane, exceeded)
  assert.equal(warn.isUnknown, false)
  assert.equal(warn.hasWarning, true)
  assert.deepEqual(warn.exceededWindows, ['w'])
})
