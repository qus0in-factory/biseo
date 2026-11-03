import test from 'node:test'
import assert from 'node:assert/strict'
import { timingSafeEqual } from '../infra/password-crypto.js'

test('timingSafeEqual comparison', () => {
  assert.equal(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2])), true)
  assert.equal(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 3])), false)
  assert.equal(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1])), false)
})
