import test from 'node:test'
import assert from 'node:assert/strict'
import { whamReset } from './codex-wham-reset.js'

const checkedAt = '2026-11-01T00:00:00Z'
test('absolute reset wins over relative reset', () => {
  assert.equal(whamReset({ reset_at: 1793491200, reset_after_seconds: 99 }, checkedAt),
    '2026-11-01T00:00:00.000Z')
})
test('invalid resets never throw or fabricate timestamps', () => {
  for (const value of [NaN, Infinity, 'tomorrow', 1e20]) {
    assert.equal(whamReset({ reset_at: value }, checkedAt), null)
  }
  assert.equal(whamReset({ reset_after_seconds: -1 }, checkedAt), null)
})
