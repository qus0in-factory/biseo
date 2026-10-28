import assert from 'node:assert/strict'
import test from 'node:test'
import { issueClaims } from '../domain/issue.js'
import { generateKeys } from '../infra/keys.js'
import { PasetoV4PublicSigner, PasetoV4PublicVerifier } from '../infra/paseto-v4-public.js'
import { policy } from './fixture.js'

test('rejects a tampered token', async () => {
  const keys = await generateKeys()
  const signer = new PasetoV4PublicSigner(keys.secretKey)
  const verifier = new PasetoV4PublicVerifier(keys.publicKey)
  const token = await signer.sign(issueClaims(policy, 'service', 'worker'))
  const i = Math.floor(token.length / 2)
  const tampered = `${token.slice(0, i)}${token[i] === 'A' ? 'B' : 'A'}${token.slice(i + 1)}`
  await assert.rejects(() => verifier.verify(tampered))
})
