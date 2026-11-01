import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import { findMatchingUsage } from './pane-usage-match'
import { makeTestPane as p } from './pane-usage-test-helper'
import { testProviders as provs } from './pane-usage-test-providers'

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
