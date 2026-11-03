import assert from 'node:assert/strict'
import test from 'node:test'
import { describe } from 'node:test'
import { findMatchingUsage } from './pane-usage-match'
import { makeTestPane as p } from '../test-util/pane-usage-test-helper'
import { testProviders as provs } from '../test-util/pane-usage-test-providers'
import { makeTestPane } from '../test-util/pane-usage-test-helper'
import { testProviders } from '../test-util/pane-usage-test-providers'
import { makeTestPane as pane } from '../test-util/pane-usage-test-helper'
import { testProviders as import9_p } from '../test-util/pane-usage-test-providers'
import { observedPanes } from '../test-util/usage-panel-fixture'
import { panelProviders } from '../test-util/usage-panel-rows'
import { paneUsageWindows } from './pane-usage-windows'
import { paneUsageSummary } from './paneUsageSummary'
describe('findMatchingUsage agentKind isolation', () => {
  test('returns null when agentKind is execution tool or unknown', () => {
    assert.equal(findMatchingUsage(p('opencode', 'opus'), provs), null)
    assert.equal(findMatchingUsage(p('opencode', 'terra-gpt'), provs), null)
    assert.equal(findMatchingUsage(p('opencode', 'beam-go'), provs), null)
    assert.equal(findMatchingUsage(p('opencode', 'claude'), provs), null)
    assert.equal(findMatchingUsage(p(null, 'worker'), provs), null)
    assert.equal(findMatchingUsage(p('unsupported', 'worker'), provs), null)
  })
})
test('OpenCode uses the observed provider',()=>{
 for(const k of['ollama','codex','claude','opencode-go'])
  assert.equal(findMatchingUsage({...makeTestPane('opencode'),modelProvider:k},testProviders)?.provider,k)
})
test('unknown observed provider never falls back to the tool',()=>{
 for(const k of['opencode','google'])
  assert.equal(findMatchingUsage({...makeTestPane('opencode'),modelProvider:k},testProviders),null)
 assert.equal(findMatchingUsage(makeTestPane('opencode'),testProviders),null)
})
{
const p = import9_p;
describe('findMatchingUsage providers', () => {
  test('matches standard providers by kind', () => {
    assert.equal(findMatchingUsage(pane('claude'), p)?.provider, 'claude')
    assert.equal(findMatchingUsage(pane('codex'), p)?.provider, 'codex')
    assert.equal(findMatchingUsage(pane('agy'), p)?.provider, 'agy')
    assert.equal(findMatchingUsage(pane('gemini'), p)?.provider, 'agy')
    assert.equal(findMatchingUsage(pane('grok'), p)?.provider, 'grok')
    assert.equal(findMatchingUsage(pane('ollama'), p)?.provider, 'ollama')
  })
})
}
test('Worker-shaped usage links by observed provider, never panel aliases', () => {
  const expected = ['claude', 'agy', 'codex', 'ollama', undefined]
  assert.deepEqual(observedPanes.map(p => findMatchingUsage(p, panelProviders)?.provider), expected)
  assert.deepEqual(observedPanes.map(p => paneUsageSummary(p, panelProviders)?.remaining),
    [39, 70, 96, 97, undefined])
  const agy = findMatchingUsage(observedPanes[1], panelProviders)!
  assert.equal(paneUsageWindows(observedPanes[1], agy).length, 1)
})
