import assert from 'node:assert/strict'
import test from 'node:test'
import { usageForPane } from './usageMatch.js'

const codex = { provider: 'codex', state: 'available' as const, windows: [] }

test('matching provider is returned only on exact agentKind match', () => {
  assert.deepEqual(usageForPane([codex], 'codex'), [codex])
})

test('missing, undefined, and mismatched providers are unknown without estimates', () => {
  for (const kind of [undefined, null, 'opencode', 'claude', '']) {
    const rows = usageForPane([codex], kind)
    assert.equal(rows[0].state, 'unknown')
    assert.equal(rows[0].windows.length, 0)
    assert.notEqual(rows[0].provider, 'codex')
  }
})

test('mobile selection changes reuse the same pure match', () => {
  assert.deepEqual(usageForPane([codex], 'codex'), [codex])
  assert.equal(usageForPane([codex], 'opencode')[0].state, 'unknown')
})
