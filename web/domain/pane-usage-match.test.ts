import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import type { PaneSummary } from './timeline'
import type { UsageProvider } from './usage'
import { findMatchingUsage } from './pane-usage-match'

const makePane = (kind: string | null): PaneSummary => ({
  paneId: 'p1',
  tabId: 't1',
  name: 'Test Pane',
  agentKind: kind,
  agentName: 'worker',
  status: 'idle',
  sendable: true,
  disabledReason: null,
})

describe('findMatchingUsage', () => {
  const providers: UsageProvider[] = [
    { provider: 'claude', state: 'available', windows: [] },
    { provider: 'codex', state: 'available', windows: [] },
    { provider: 'agy', state: 'available', windows: [] },
    { provider: 'grok', state: 'available', windows: [] },
    { provider: 'ollama', state: 'available', windows: [] },
    { provider: 'opencode-go', state: 'available', windows: [] },
  ]

  test('matches claude, codex, agy, grok, ollama', () => {
    assert.equal(findMatchingUsage(makePane('claude'), providers)?.provider, 'claude')
    assert.equal(findMatchingUsage(makePane('codex'), providers)?.provider, 'codex')
    assert.equal(findMatchingUsage(makePane('agy'), providers)?.provider, 'agy')
    assert.equal(findMatchingUsage(makePane('gemini'), providers)?.provider, 'agy')
    assert.equal(findMatchingUsage(makePane('grok'), providers)?.provider, 'grok')
    assert.equal(findMatchingUsage(makePane('ollama'), providers)?.provider, 'ollama')
    assert.equal(findMatchingUsage(makePane('opencode'), providers)?.provider, 'opencode-go')
  })

  test('returns null for missing, empty, or unknown provider', () => {
    assert.equal(findMatchingUsage(makePane(null), providers), null)
    assert.equal(findMatchingUsage(makePane(''), providers), null)
    assert.equal(findMatchingUsage(makePane('unsupported'), providers), null)
  })
})
