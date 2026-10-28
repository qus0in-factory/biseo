import test from 'node:test'
import assert from 'node:assert/strict'
import { WebCryptoPasswordVerifier, hashPassword } from '../infra/password.js'

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
