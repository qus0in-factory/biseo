import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluatePaneUsageWarning } from './pane-usage-warning.js'
import { makeTestPane } from './pane-usage-test-helper.js'

test('codex pro plan without five-hour window warns only on weekly threshold and is not unknown', () => {
  const pane = makeTestPane('codex', 'sol')
  const healthy = [{
    provider: 'codex',
    state: 'available' as const,
    windows: [{ window: 'w', usedPercent: 40, resetsAt: null, checkedAt: null, limitReached: false, source: 'codex' }]
  }]
  const res = evaluatePaneUsageWarning(pane, healthy)
  assert.equal(res.isUnknown, false)
  assert.equal(res.hasWarning, false)

  const empty = [{ provider: 'codex', state: 'available' as const, windows: [] }]
  assert.equal(evaluatePaneUsageWarning(pane, empty).isUnknown, true)
})
