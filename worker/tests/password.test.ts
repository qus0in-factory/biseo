import test from 'node:test'
import assert from 'node:assert/strict'
import { WebCryptoPasswordVerifier, hashPassword } from '../infra/password.js'
import {
  DEFAULT_PBKDF2_CONFIG,
  WORKERD_PBKDF2_MAX_ITERATIONS,
} from '../infra/password-types.js'

test('verifier validates and rejects', async () => {
  const verifier = new WebCryptoPasswordVerifier()
  const cfg = { iterations: 500, keyLength: 32, digest: 'SHA-256' as const }
  const stored = await hashPassword('secret', cfg)
  assert.equal(await verifier.verify('secret', stored), true)
  assert.equal(await verifier.verify('wrong', stored), false)
})

test('workerd pbkdf2 max ceiling defaults to 100k', () => {
  assert.equal(WORKERD_PBKDF2_MAX_ITERATIONS, 100000)
  assert.equal(DEFAULT_PBKDF2_CONFIG.iterations, 100000)
  assert.equal(DEFAULT_PBKDF2_CONFIG.digest, 'SHA-256')
})

test('fails on iterations exceeding workerd ceiling of 100k', async () => {
  const over = { iterations: 100_001, keyLength: 32, digest: 'SHA-256' as const }
  await assert.rejects(
    async () => hashPassword('test', over),
    (err: Error) => err instanceof RangeError && /100000/.test(err.message),
  )
  const v = new WebCryptoPasswordVerifier()
  await assert.rejects(
    async () => v.verify('test', 'pbkdf2$sha-256$100001$1234$5678'),
    (err: Error) => err instanceof RangeError && /100000/.test(err.message),
  )
})

test('rejects malformed string', async () => {
  const v = new WebCryptoPasswordVerifier()
  assert.equal(await v.verify('p', 'bad'), false)
  assert.equal(await v.verify('p', 'pbkdf2$md5$10$aa$bb'), false)
  assert.equal(await v.verify('p', 'pbkdf2$sha-256$x$aa$bb'), false)
})
