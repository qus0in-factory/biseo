import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import { evaluatePaneUsageWarning as evalW } from './pane-usage-warning'
import { makeTestPane as p } from './pane-usage-test-helper'

describe('evaluatePaneUsageWarning unknown handling', () => {
  test('returns unknown for missing kind or provider', () => {
    assert.equal(evalW(p(null, 'worker'), []).isUnknown, true)
    assert.equal(evalW(p('claude', 'opus'), []).isUnknown, true)
    assert.equal(evalW(p('claude', 'opus'), [{ provider: 'claude', state: 'unknown', windows: [] }]).isUnknown, true)
  })

  test('returns unknown when windows have null usedPercent', () => {
    const w = [{ window: 'primary', usedPercent: null, resetsAt: null, checkedAt: null, limitReached: false, source: null }]
    assert.equal(evalW(p('claude', 'opus'), [{ provider: 'claude', state: 'available', windows: w }]).isUnknown, true)
  })
})
