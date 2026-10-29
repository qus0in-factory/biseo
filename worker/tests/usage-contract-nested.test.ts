import assert from 'node:assert/strict'
import test from 'node:test'
import { parseUsage } from '../app/usage-sync.js'
import { groupUsage } from '../app/usage-group.js'

test('nested windows preserve primary 20 and secondary 90', () => {
  const rows = parseUsage({ providers: [{ provider: 'codex', state: 'limited', windows: [
    { window: 'primary', usedPercent: 20 }, { window: 'secondary', usedPercent: 90 },
  ] }] })
  assert.deepEqual(rows.map((r) => [r.window, r.usedPercent]), [['primary', 20], ['secondary', 90]])
  assert.deepEqual(groupUsage(rows)[0].windows.map((w) => w.window), ['primary', 'secondary'])
})
