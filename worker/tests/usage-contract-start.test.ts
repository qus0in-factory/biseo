import assert from 'node:assert/strict'
import test from 'node:test'
import { parseUsage } from '../app/usage-sync.js'
import { groupUsage } from '../app/usage-group.js'

test('a window start survives grouping for exact progress', () => {
  const rows = parseUsage({
    providers: [{
      provider: 'codex',
      state: 'available',
      windows: [{ window: 'secondary', usedPercent: 50, startsAt: '2026-10-25T00:00:00Z' }],
    }],
  })
  assert.equal(groupUsage(rows)[0].windows[0].startsAt, '2026-10-25T00:00:00Z')
})
