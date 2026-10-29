import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRateLimits } from './codex-rate-limit-parse.js'

const line = (rate: unknown) =>
  JSON.stringify({
    type: 'event_msg',
    payload: { type: 'token_count', rate_limits: rate, message: 'SECRET body' },
  })

test('reads only whitelisted rate limit fields', () => {
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
  assert.deepEqual(Object.keys(r!).sort(), ['primary', 'reached', 'secondary'])
  assert.doesNotMatch(JSON.stringify(r), /SECRET/)
})

test('ignores non-token events and corrupt lines', () => {
  assert.equal(parseRateLimits('{"type":"event_msg","payload":{"type":"other"}}'), null)
  assert.equal(parseRateLimits('{broken'), null)
  assert.equal(parseRateLimits(line({ rate_limit_reached_type: null }))?.reached, null)
})

test('accepts ISO reset timestamps', () => {
  const at = '2026-10-29T12:00:00.000Z'
  const r = parseRateLimits(line({ primary: { resets_at: at } }))
  assert.equal(r?.primary, at)
})
