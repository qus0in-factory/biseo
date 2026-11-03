import test from 'node:test'
import assert from 'node:assert/strict'
import { makeTestPane } from '../test-util/pane-usage-test-helper'
import { evaluatePaneUsageWarning } from './pane-usage-warning.js'
import { paneUsageSummary } from './paneUsageSummary'
import { detectUsageWindow } from '../../shared/usage-window-detect.js'
import { normalizeWarningWindow } from './usage-window-norm.js'

test('free models do not connect to paid Go usage or warn',()=>{
 const go={provider:'opencode-go',state:'limited' as const,windows:[{window:'primary',usedPercent:100,resetsAt:null,checkedAt:null,limitReached:true,source:null}]}
 for(const modelId of['beam','glm-5.3-flash']){
  const pane={...makeTestPane('opencode',modelId),modelId,modelProvider:'opencode'}
  const w=evaluatePaneUsageWarning(pane,[go])
  assert.equal(w.hasWarning,false)
  assert.equal(w.isUnknown,true)
  assert.equal(paneUsageSummary(pane,[go]),null)
 }
})
test('0.4.5 integration: weekly duration maps to w and 98% warns; beam free does not warn', () => {
  assert.equal(detectUsageWindow(604800), 'w')
  assert.equal(normalizeWarningWindow('secondary'), 'w')
  const codexPane = { ...makeTestPane('codex', 'gpt'), modelProvider: 'codex' }
  const providers = [{ provider: 'codex', state: 'available' as const, windows: [{ window: 'secondary', usedPercent: 98, resetsAt: '2026-11-09T08:00:00Z', checkedAt: null, limitReached: false, source: 'codex' }] }]
  const w = evaluatePaneUsageWarning(codexPane, providers as any)
  assert.equal(w.hasWarning, true)
  const beamPane = { ...makeTestPane('opencode', 'beam'), modelId: 'beam', modelProvider: 'opencode' }
  const go = { provider: 'opencode-go', state: 'limited' as const, windows: [{ window: 'primary', usedPercent: 100, resetsAt: null, checkedAt: null, limitReached: true, source: null }] }
  const wb = evaluatePaneUsageWarning(beamPane, [go] as any)
  assert.equal(wb.hasWarning, false)
})
