import test from 'node:test'
import assert from 'node:assert/strict'
import { makeTestPane } from '../test-util/pane-usage-test-helper'
import { agyWarningFixture } from '../test-util/agy-warning-fixture'
import { describe } from 'node:test'
import { evaluatePaneUsageWarning } from './pane-usage-warning.js'
import { prov } from '../test-util/paneUsageSummaryFixture'
import { win } from '../test-util/paneUsageSummaryFixture'
import type { PaneSummary } from './timeline.js'
import type { UsageProvider } from './usage.js'
import { warningWindow } from './pane-usage-warning.test-util'
import { warningProvider } from './pane-usage-warning.test-util'

test('Gemini ignores exhausted Claude and Argon pools; own threshold warns', () => {
 const pane = {...makeTestPane('agy', 'gf'), modelId: 'gemini-3-pro'}
 assert.equal(evaluatePaneUsageWarning(pane, [agyWarningFixture(10)]).hasWarning, false)
 assert.equal(evaluatePaneUsageWarning(pane, [agyWarningFixture(95)]).hasWarning, true)
})
test('unknown models never infer a family from aliases or runtime names', () => {
 for (const modelId of [null, '', 'other-model']) {
  const pane = {...makeTestPane('agy', 'Gemini'), modelId}
  assert.equal(evaluatePaneUsageWarning(pane, [agyWarningFixture(100)]).hasWarning, false)
 }
})
describe('evaluatePaneUsageWarning config', () => {
  test('configurable thresholds', () => {
    const wins = [{ window: 'primary', usedPercent: 80, resetsAt: null, checkedAt: null, limitReached: false, source: null }]
    const provs = [{ provider: 'claude', state: 'available' as const, windows: wins }]
    assert.equal(evaluatePaneUsageWarning(makeTestPane('claude', 'opus'), provs).hasWarning, false)
    const r = evaluatePaneUsageWarning(makeTestPane('claude', 'opus'), provs, { fiveHour: 75, weekly: 95, monthly: 95 })
    assert.equal(r.hasWarning, true)
    assert.deepEqual(r.exceededWindows, ['5h'])
  })
})
test('corrupted window alone is unknown while mixed with exceeded window warns', () => {
  const pane = makeTestPane('codex', 'sol')
  const corruptedOnly = warningProvider([warningWindow('unknown', null, 'codex')], 'unknown')
  const unk = evaluatePaneUsageWarning(pane, corruptedOnly)
  assert.equal(unk.isUnknown, true)
  assert.equal(unk.hasWarning, false)

  const mixedWarn = warningProvider([
    warningWindow('unknown', null, 'codex'), warningWindow('w', 99, 'codex'),
  ])
  const mix = evaluatePaneUsageWarning(pane, mixedWarn)
  assert.equal(mix.hasWarning, true)
  assert.deepEqual(mix.exceededWindows, ['w'])
})
const ollama=(used:number)=>({
 ...prov('ollama',[win('included_balance',null)]),
 metrics:[{id:'included_balance',label:'i',unit:'currency',used,limit:100,remaining:100-used,resetsAt:null}],
})
test('observed provider connects warning',()=>{
 const ds={...makeTestPane('opencode','ds-o'),modelProvider:'ollama'}
 assert.equal(evaluatePaneUsageWarning(ds,[ollama(98)]).hasWarning,true)
 assert.equal(evaluatePaneUsageWarning(ds,[ollama(97)]).hasWarning,false)
 const ga={...makeTestPane('agy','ga'),modelId:'gemini-4-argon'},pool=[agyWarningFixture(10)]
 assert.equal(evaluatePaneUsageWarning(ga,pool).hasWarning,true)
 assert.equal(evaluatePaneUsageWarning({...ga,modelId:'gemini-3.8-flash'},pool).hasWarning,false)
})
describe('evaluatePaneUsageWarning multi window', () => {
  test('multiple windows exceeded', () => {
    const wins = [warningWindow('primary', 95), warningWindow('secondary', 99)]
    const r = evaluatePaneUsageWarning(makeTestPane('claude', 'opus'), [{ provider: 'claude', state: 'available', windows: wins }])
    assert.equal(r.hasWarning, true)
    assert.deepEqual(r.exceededWindows, ['5h', 'w'])
    assert.match(r.label!, /5h\/w/)
  })
})
test('codex pro warns on weekly threshold and is not unknown below it', () => {
  const pane = makeTestPane('codex', 'sol')
  const healthy = warningProvider([warningWindow('w', 40, 'codex')])
  const ok = evaluatePaneUsageWarning(pane, healthy)
  assert.equal(ok.isUnknown, false)
  assert.equal(ok.hasWarning, false)

  const exceeded = warningProvider([warningWindow('w', 99, 'codex')])
  const warn = evaluatePaneUsageWarning(pane, exceeded)
  assert.equal(warn.isUnknown, false)
  assert.equal(warn.hasWarning, true)
  assert.deepEqual(warn.exceededWindows, ['w'])
})
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
describe('evaluatePaneUsageWarning unknown handling', () => {
  test('returns unknown for missing kind or provider', () => {
    assert.equal(evaluatePaneUsageWarning(makeTestPane(null, 'worker'), []).isUnknown, true)
    assert.equal(evaluatePaneUsageWarning(makeTestPane('claude', 'opus'), []).isUnknown, true)
    assert.equal(evaluatePaneUsageWarning(makeTestPane('claude', 'opus'), [{ provider: 'claude', state: 'unknown', windows: [] }]).isUnknown, true)
  })

  test('returns unknown when windows have null usedPercent', () => {
    const w = [{ window: 'primary', usedPercent: null, resetsAt: null, checkedAt: null, limitReached: false, source: null }]
    assert.equal(evaluatePaneUsageWarning(makeTestPane('claude', 'opus'), [{ provider: 'claude', state: 'available', windows: w }]).isUnknown, true)
  })
})
const w=(window:string,u:number)=>[{provider:'codex',state:'available' as const,windows:[{window,usedPercent:u,resetsAt:null,checkedAt:null,limitReached:false,source:null}]}]
test('weekly and monthly boundaries 98% and unknown window ignored',()=>{
 for(const k of['secondary','w','monthly','m']){
  assert.equal(evaluatePaneUsageWarning(makeTestPane('codex','sol'),w(k,97.9)).hasWarning,false)
  assert.equal(evaluatePaneUsageWarning(makeTestPane('codex','sol'),w(k,98)).hasWarning,true)
 }
 assert.equal(evaluatePaneUsageWarning(makeTestPane('codex','sol'),w('unknown',100)).isUnknown,true)
})
describe('evaluatePaneUsageWarning 5h', () => {
  const p5 = (u: number) => [{ provider: 'claude', state: 'available' as const, windows: [warningWindow('primary', u)] }]

  test('5h threshold boundary 90%', () => {
    assert.equal(evaluatePaneUsageWarning(makeTestPane('claude', 'opus'), p5(89.9)).hasWarning, false)
    const r = evaluatePaneUsageWarning(makeTestPane('claude', 'opus'), p5(90))
    assert.equal(r.hasWarning, true)
    assert.deepEqual(r.exceededWindows, ['5h'])
    assert.match(r.label!, /5h/)
  })
})
