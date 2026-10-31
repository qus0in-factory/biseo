import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import { findMatchingUsage } from './pane-usage-match'
import { makeTestPane as p } from './pane-usage-test-helper'
import { testProviders as provs } from './pane-usage-test-providers'

describe('findMatchingUsage model matching', () => {
  test('resolves opencode pane by model in agentName', () => {
    assert.equal(findMatchingUsage(p('opencode', 'opus'), provs)?.provider, 'claude')
    assert.equal(findMatchingUsage(p('opencode', 'terra-gpt'), provs)?.provider, 'codex')
    assert.equal(findMatchingUsage(p('opencode', 'beam-go'), provs)?.provider, 'opencode-go')
    assert.equal(findMatchingUsage(p('opencode', 'unknown'), provs), null)
  })

  test('returns null for missing or unknown provider', () => {
    assert.equal(findMatchingUsage(p(null, 'worker'), provs), null)
    assert.equal(findMatchingUsage(p('unsupported', 'worker'), provs), null)
  })
})
