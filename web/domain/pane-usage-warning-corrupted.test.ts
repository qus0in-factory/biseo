import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluatePaneUsageWarning } from './pane-usage-warning.js'
import { makeTestPane } from './pane-usage-test-helper.js'

test('corrupted window alone is unknown while mixed with exceeded window warns', () => {
  const pane = makeTestPane('codex', 'sol')
  const corruptedOnly = [{
    provider: 'codex', state: 'unknown' as const,
    windows: [{ window: 'unknown', usedPercent: null, resetsAt: null, checkedAt: null, limitReached: false, source: 'codex' }]
  }]
  const unk = evaluatePaneUsageWarning(pane, corruptedOnly)
  assert.equal(unk.isUnknown, true)
  assert.equal(unk.hasWarning, false)

  const mixedWarn = [{
    provider: 'codex', state: 'available' as const,
    windows: [
      { window: 'unknown', usedPercent: null, resetsAt: null, checkedAt: null, limitReached: false, source: 'codex' },
      { window: 'w', usedPercent: 99, resetsAt: null, checkedAt: null, limitReached: false, source: 'codex' }
    ]
  }]
  const mix = evaluatePaneUsageWarning(pane, mixedWarn)
  assert.equal(mix.hasWarning, true)
  assert.deepEqual(mix.exceededWindows, ['w'])
})
