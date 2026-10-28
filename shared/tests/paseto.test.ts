import assert from 'node:assert/strict'
import test from 'node:test'
import { issueClaims } from '../domain/issue.js'
import { generateKeys } from '../infra/keys.js'
import { PasetoV4PublicSigner, PasetoV4PublicVerifier } from '../infra/paseto-v4-public.js'
import { policy } from './fixture.js'

test('signs and verifies v4.public tokens', async () => {
  const keys = await generateKeys()
  const signer = new PasetoV4PublicSigner(keys.secretKey)
  const verifier = new PasetoV4PublicVerifier(keys.publicKey)
  const token = await signer.sign(issueClaims(policy, 'service', 'worker'))
  assert.match(token, /^v4\.public\./)
  const claims = (await verifier.verify(token)) as { iss: string }
  assert.equal(claims.iss, 'biseo')
})
