import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRateLimits } from './codex-rate-limit-parse.js'
import { line } from './codex-rate-limit-parse-fixture.test.js'

test('the rollout timestamp becomes the data reference time', () => {
  const r = parseRateLimits(line({ rate_limit_reached_type: null }))
  assert.equal(r?.snapshotAt, '2026-10-29T10:00:00.000Z')
  assert.equal(parseRateLimits(line({}, null))?.snapshotAt, null)
  assert.equal(parseRateLimits(line({}, 'not-a-date'))?.snapshotAt, null)
})

test('ignores non-token events and corrupt lines', () => {
  assert.equal(parseRateLimits('{"type":"event_msg","payload":{"type":"other"}}'), null)
  assert.equal(parseRateLimits('{broken'), null)
  assert.equal(parseRateLimits(line({ rate_limit_reached_type: null }))?.reached, null)
})
