import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import { evaluatePaneUsageWarning as evalW } from './pane-usage-warning'
import { makeTestPane as p } from './pane-usage-test-helper'

const w = (window: string, u: number) => [{ provider: 'claude', state: 'available' as const, windows: [{ window, usedPercent: u, resetsAt: null, checkedAt: null, limitReached: false, source: null }] }]

describe('evaluatePaneUsageWarning weekly and monthly', () => {
  test('weekly boundary 98%', () => {
    assert.equal(evalW(p('claude', 'opus'), w('secondary', 97.9)).hasWarning, false)
    assert.equal(evalW(p('claude', 'opus'), w('secondary', 98)).hasWarning, true)
  })

  test('monthly boundary 98%', () => {
    assert.equal(evalW(p('claude', 'opus'), w('monthly', 97.9)).hasWarning, false)
    assert.equal(evalW(p('claude', 'opus'), w('monthly', 98)).hasWarning, true)
  })
})
