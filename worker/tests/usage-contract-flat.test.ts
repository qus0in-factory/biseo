import assert from 'node:assert/strict'
import test from 'node:test'
import { parseUsage } from '../app/usage-sync.js'
import { groupUsage } from '../app/usage-group.js'

test('flat provider rows keep both windows and missing percent stays null', () => {
  const rows = parseUsage({ providers: [
    { provider: 'codex', state: 'available', window: 'primary', usedPercent: 20 },
    { provider: 'codex', state: 'available', window: 'secondary', usedPercent: null },
  ] })
  assert.equal(rows.length, 2)
  assert.equal(rows[1].usedPercent, null)
  assert.equal(groupUsage(rows)[0].windows.length, 2)
})
