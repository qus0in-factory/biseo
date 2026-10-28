import assert from 'node:assert/strict'
import test from 'node:test'
import { issueClaims } from '../domain/issue.js'
import { generateExtractableKeys } from '../infra/keys.js'
import { exportKeys, importSigningKey, importVerificationKey } from '../infra/paserk.js'
import { PasetoV4PublicSigner, PasetoV4PublicVerifier } from '../infra/paseto-v4-public.js'
import { policy } from './fixture.js'

test('round-trips PASERK keys', async () => {
  const paserk = await exportKeys(await generateExtractableKeys())
  assert.ok(paserk.secretKey.startsWith('k4.secret.'))
  assert.ok(paserk.publicKey.startsWith('k4.public.'))
  const signer = new PasetoV4PublicSigner(await importSigningKey(paserk.secretKey))
  const verifier = new PasetoV4PublicVerifier(await importVerificationKey(paserk.publicKey))
  const token = await signer.sign(issueClaims(policy, 'service', 'worker'))
  const claims = (await verifier.verify(token)) as { sub: string }
  assert.equal(claims.sub, 'worker')
})
