import assert from 'node:assert/strict'
import test from 'node:test'
import { observedPanes } from './usage-panel-fixture.test-util'
import { panelProviders } from './usage-panel-rows.test-util'
import { findMatchingUsage } from './pane-usage-match'
import { paneUsageWindows } from './pane-usage-windows'
import { paneUsageSummary } from './paneUsageSummary'

test('Worker-shaped usage links by observed provider, never panel aliases', () => {
  const expected = ['claude', 'agy', 'codex', 'ollama', undefined]
  assert.deepEqual(observedPanes.map(p => findMatchingUsage(p, panelProviders)?.provider), expected)
  assert.deepEqual(observedPanes.map(p => paneUsageSummary(p, panelProviders)?.remaining),
    [39, 70, 96, 97, undefined])
  const agy = findMatchingUsage(observedPanes[1], panelProviders)!
  assert.equal(paneUsageWindows(observedPanes[1], agy).length, 1)
})
