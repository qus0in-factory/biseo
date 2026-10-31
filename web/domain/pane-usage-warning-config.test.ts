import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import { evaluatePaneUsageWarning as evalW } from './pane-usage-warning'
import { makeTestPane as p } from './pane-usage-test-helper'

describe('evaluatePaneUsageWarning config', () => {
  test('configurable thresholds', () => {
    const wins = [{ window: 'primary', usedPercent: 80, resetsAt: null, checkedAt: null, limitReached: false, source: null }]
    const provs = [{ provider: 'claude', state: 'available' as const, windows: wins }]
    assert.equal(evalW(p('claude', 'opus'), provs).hasWarning, false)
    const r = evalW(p('claude', 'opus'), provs, { fiveHour: 75, weekly: 95, monthly: 95 })
    assert.equal(r.hasWarning, true)
    assert.deepEqual(r.exceededWindows, ['5h'])
  })
})
