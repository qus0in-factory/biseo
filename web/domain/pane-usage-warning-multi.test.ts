import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import { evaluatePaneUsageWarning as evalW } from './pane-usage-warning'
import { makeTestPane as p } from './pane-usage-test-helper'

describe('evaluatePaneUsageWarning multi window', () => {
  test('multiple windows exceeded', () => {
    const wins = [
      { window: 'primary', usedPercent: 95, resetsAt: null, checkedAt: null, limitReached: false, source: null },
      { window: 'secondary', usedPercent: 99, resetsAt: null, checkedAt: null, limitReached: false, source: null },
    ]
    const r = evalW(p('claude', 'opus'), [{ provider: 'claude', state: 'available', windows: wins }])
    assert.equal(r.hasWarning, true)
    assert.deepEqual(r.exceededWindows, ['5h', 'w'])
    assert.match(r.label!, /5h\/w/)
  })
})
