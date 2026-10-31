import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import { evaluatePaneUsageWarning as evalWarning } from './pane-usage-warning'
import { makeTestPane as p } from './pane-usage-test-helper'

describe('evaluatePaneUsageWarning 5h', () => {
  const p5 = (u: number) => [{
    provider: 'claude',
    state: 'available' as const,
    windows: [{ window: 'primary', usedPercent: u, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
  }]

  test('5h threshold boundary 90%', () => {
    assert.equal(evalWarning(p('claude', 'opus'), p5(89.9)).hasWarning, false)
    const r = evalWarning(p('claude', 'opus'), p5(90))
    assert.equal(r.hasWarning, true)
    assert.deepEqual(r.exceededWindows, ['5h'])
    assert.match(r.label!, /5h/)
  })
})
