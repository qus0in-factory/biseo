import assert from 'node:assert/strict'
import test from 'node:test'
import { issueClaims } from '../domain/issue.js'
import { validateClaims } from '../domain/validate.js'
import { generateKeys } from '../infra/keys.js'
import { PasetoV4PublicSigner, PasetoV4PublicVerifier } from '../infra/paseto-v4-public.js'
import { policy } from './support/fixture.js'

test('applies the same clock tolerance in adapter and domain', async () => {
  const keys = await generateKeys()
  const signer = new PasetoV4PublicSigner(keys.secretKey)
  const verifier = new PasetoV4PublicVerifier(keys.publicKey, policy.clockToleranceSeconds)
  const claims = issueClaims(policy, 'service', 'worker', new Date(Date.now() + 4000))
  const token = await signer.sign(claims)
  const verified = await verifier.verify(token)
  assert.equal(validateClaims(policy, 'service', verified).sub, 'worker')
})

{

test('signs and verifies v4.public tokens', async () => {
  const keys = await generateKeys()
  const signer = new PasetoV4PublicSigner(keys.secretKey)
  const verifier = new PasetoV4PublicVerifier(keys.publicKey)
  const token = await signer.sign(issueClaims(policy, 'service', 'worker'))
  assert.match(token, /^v4\.public\./)
  const claims = (await verifier.verify(token)) as { iss: string }
  assert.equal(claims.iss, 'biseo')
})
}
{

test('rejects a tampered token', async () => {
  const keys = await generateKeys()
  const signer = new PasetoV4PublicSigner(keys.secretKey)
  const verifier = new PasetoV4PublicVerifier(keys.publicKey)
  const token = await signer.sign(issueClaims(policy, 'service', 'worker'))
  const i = Math.floor(token.length / 2)
  const tampered = `${token.slice(0, i)}${token[i] === 'A' ? 'B' : 'A'}${token.slice(i + 1)}`
  await assert.rejects(() => verifier.verify(tampered))
})
}
