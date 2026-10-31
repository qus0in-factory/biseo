import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import type { PaneSummary } from './timeline'
import type { UsageProvider } from './usage'
import { evaluatePaneUsageWarning } from './pane-usage-warning'

const makePane = (kind: string | null = 'claude'): PaneSummary => ({
  paneId: 'p1',
  tabId: 't1',
  name: 'Opus Worker',
  agentKind: kind,
  agentName: 'opus',
  status: 'idle',
  sendable: true,
  disabledReason: null,
})

describe('evaluatePaneUsageWarning', () => {
  test('boundary conditions for 5h 90%, w 98%, m 98%', () => {
    const pane = makePane('claude')

    // 89.9% -> no warning
    let p: UsageProvider = {
      provider: 'claude',
      state: 'available',
      windows: [{ window: 'primary', usedPercent: 89.9, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
    }
    let res = evaluatePaneUsageWarning(pane, [p])
    assert.equal(res.hasWarning, false)
    assert.equal(res.isUnknown, false)

    // 90% -> warning
    p = {
      provider: 'claude',
      state: 'available',
      windows: [{ window: 'primary', usedPercent: 90, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
    }
    res = evaluatePaneUsageWarning(pane, [p])
    assert.equal(res.hasWarning, true)
    assert.deepEqual(res.exceededWindows, ['5h'])
    assert.match(res.label!, /5h/)

    // 97.9% weekly -> no warning
    p = {
      provider: 'claude',
      state: 'available',
      windows: [{ window: 'secondary', usedPercent: 97.9, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
    }
    res = evaluatePaneUsageWarning(pane, [p])
    assert.equal(res.hasWarning, false)

    // 98% weekly -> warning
    p = {
      provider: 'claude',
      state: 'available',
      windows: [{ window: 'secondary', usedPercent: 98, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
    }
    res = evaluatePaneUsageWarning(pane, [p])
    assert.equal(res.hasWarning, true)
    assert.deepEqual(res.exceededWindows, ['w'])

    // monthly 98% -> warning
    const grokPane = makePane('grok')
    p = {
      provider: 'grok',
      state: 'available',
      windows: [{ window: 'monthly', usedPercent: 98, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
    }
    res = evaluatePaneUsageWarning(grokPane, [p])
    assert.equal(res.hasWarning, true)
    assert.deepEqual(res.exceededWindows, ['m'])
  })

  test('multiple windows exceeded', () => {
    const pane = makePane('claude')
    const p: UsageProvider = {
      provider: 'claude',
      state: 'available',
      windows: [
        { window: 'primary', usedPercent: 95, resetsAt: null, checkedAt: null, limitReached: false, source: null },
        { window: 'secondary', usedPercent: 99, resetsAt: null, checkedAt: null, limitReached: false, source: null },
      ],
    }
    const res = evaluatePaneUsageWarning(pane, [p])
    assert.equal(res.hasWarning, true)
    assert.deepEqual(res.exceededWindows, ['5h', 'w'])
    assert.match(res.label!, /5h\/w/)
  })

  test('unknown handling - never treat as normal', () => {
    // 1. Pane has no agentKind
    const noKindPane = makePane(null)
    let res = evaluatePaneUsageWarning(noKindPane, [])
    assert.equal(res.hasWarning, false)
    assert.equal(res.isUnknown, true)

    // 2. Provider not found in usage
    const pane = makePane('claude')
    res = evaluatePaneUsageWarning(pane, [])
    assert.equal(res.hasWarning, false)
    assert.equal(res.isUnknown, true)

    // 3. Provider state is unknown
    const pUnknown: UsageProvider = {
      provider: 'claude',
      state: 'unknown',
      windows: [],
    }
    res = evaluatePaneUsageWarning(pane, [pUnknown])
    assert.equal(res.hasWarning, false)
    assert.equal(res.isUnknown, true)

    // 4. Windows has null usedPercent (#140, #141)
    const pNullWin: UsageProvider = {
      provider: 'claude',
      state: 'available',
      windows: [{ window: 'primary', usedPercent: null, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
    }
    res = evaluatePaneUsageWarning(pane, [pNullWin])
    assert.equal(res.hasWarning, false)
    assert.equal(res.isUnknown, true)
  })

  test('configurable thresholds', () => {
    const pane = makePane('claude')
    const p: UsageProvider = {
      provider: 'claude',
      state: 'available',
      windows: [{ window: 'primary', usedPercent: 80, resetsAt: null, checkedAt: null, limitReached: false, source: null }],
    }
    // Default 90% -> no warning
    let res = evaluatePaneUsageWarning(pane, [p])
    assert.equal(res.hasWarning, false)

    // Custom 75% -> warning!
    res = evaluatePaneUsageWarning(pane, [p], { fiveHour: 75, weekly: 95, monthly: 95 })
    assert.equal(res.hasWarning, true)
    assert.deepEqual(res.exceededWindows, ['5h'])
  })
})
