import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import { findMatchingUsage } from './pane-usage-match'
import { makeTestPane as pane } from './pane-usage-test-helper'
import { testProviders as p } from './pane-usage-test-providers'

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
