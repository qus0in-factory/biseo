import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRateLimits } from './codex-rate-limit-parse.js'
import { line } from './codex-rate-limit-parse-fixture.test.js'

test('accepts ISO reset timestamps', () => {
  const at = '2026-10-29T12:00:00.000Z'
  const r = parseRateLimits(line({ primary: { resets_at: at } }))
  assert.equal(r?.primary, at)
})
