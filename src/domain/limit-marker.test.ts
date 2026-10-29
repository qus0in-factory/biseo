import test from 'node:test'
import assert from 'node:assert/strict'
import { isLimitMarker } from './limit-marker.js'

test('limit markers match recent lines case-insensitively', () => {
  assert.equal(isLimitMarker(['5H LIMIT reached'], ['5h limit']), true)
  assert.equal(isLimitMarker(['  quota exceeded  '], ['quota exceeded']), true)
  assert.equal(isLimitMarker(['all systems normal'], ['usage limit']), false)
  assert.equal(isLimitMarker(['usage limit'], []), false)
  assert.equal(isLimitMarker([], ['usage limit']), false)
})
