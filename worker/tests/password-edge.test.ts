import test from 'node:test'
import assert from 'node:assert/strict'
import { WebCryptoPasswordVerifier } from '../infra/password.js'
import { timingSafeEqual } from '../infra/password-crypto.js'

test('rejects malformed string', async () => {
  const v = new WebCryptoPasswordVerifier()
  assert.equal(await v.verify('p', 'bad'), false)
  assert.equal(await v.verify('p', 'pbkdf2$md5$10$aa$bb'), false)
  assert.equal(await v.verify('p', 'pbkdf2$sha-256$x$aa$bb'), false)
})

test('timingSafeEqual comparison', () => {
  assert.equal(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2])), true)
  assert.equal(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 3])), false)
  assert.equal(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1])), false)
})
