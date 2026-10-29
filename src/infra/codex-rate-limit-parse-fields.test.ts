import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRateLimits } from './codex-rate-limit-parse.js'
import { line } from './codex-rate-limit-parse-fixture.test.js'

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
