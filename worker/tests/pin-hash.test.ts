import assert from 'node:assert/strict'
import test from 'node:test'
import { hashPin, WebCryptoPinVerifier } from '../infra/pin-hash.js'

test('PIN hash is salted, hides plaintext, and verifies in constant time', async () => {
  const a = await hashPin('123456')
  const b = await hashPin('123456')
  assert.notEqual(a, b)
  assert.ok(!a.includes('123456'))
  const v = new WebCryptoPinVerifier()
  assert.equal(await v.verify('123456', a), true)
  assert.equal(await v.verify('654321', a), false)
})
