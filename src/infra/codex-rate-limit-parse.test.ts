import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRateLimits } from './codex-rate-limit-parse.js'
import { line } from './test-util/codex-rollout-fixture.js'

{

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
}
{

test('reads only whitelisted rate limit fields with primary 20 and secondary 90', () => {
  const r = parseRateLimits(
    line({
      primary: { used_percent: 20, resets_at: 1793245000, secret: 'x' },
      secondary: { used_percent: 90, resets_at: 1793246000000 },
      rate_limit_reached_type: 'secondary',
      plan_type: 'plus',
    }),
  )
  assert.equal(r?.reached, 'secondary')
  assert.equal(r?.primary, new Date(1793245000000).toISOString())
  assert.equal(r?.secondary, new Date(1793246000000).toISOString())
  assert.equal(r?.primaryUsedPercent, 20)
  assert.equal(r?.secondaryUsedPercent, 90)
  assert.deepEqual(Object.keys(r!).sort(), ['primary', 'primaryUsedPercent', 'reached', 'secondary', 'secondaryUsedPercent', 'snapshotAt'])
  assert.doesNotMatch(JSON.stringify(r), /SECRET/)
})
}
{

test('accepts ISO reset timestamps', () => {
  const at = '2026-10-29T12:00:00.000Z'
  const r = parseRateLimits(line({ primary: { resets_at: at } }))
  assert.equal(r?.primary, at)
})
}
