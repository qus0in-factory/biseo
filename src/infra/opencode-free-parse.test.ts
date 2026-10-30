import test from 'node:test'
import assert from 'node:assert/strict'
import { parseOpencodeFree } from './opencode-free-parse.js'

test('parseOpencodeFree 200 is available', () => {
  const res = parseOpencodeFree(200, new Headers(), {})
  assert.equal(res.state, 'available')
  assert.equal(res.windows[0].limitReached, false)
})

test('parseOpencodeFree 429 is limited with retry', () => {
  const h = new Headers({ 'retry-after': '3600' })
  const res = parseOpencodeFree(429, h, { error: { type: 'FreeUsageLimitError' } })
  assert.equal(res.state, 'limited')
  assert.equal(res.windows[0].limitReached, true)
  assert.ok(res.windows[0].resetsAt)
})

test('parseOpencodeFree other status is unknown', () => {
  assert.equal(parseOpencodeFree(500, new Headers(), null).state, 'unknown')
})
