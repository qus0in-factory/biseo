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
