import assert from 'node:assert/strict'
import test from 'node:test'
import { importVerificationKey } from '../../shared/infra/paserk.js'
import { PasetoV4PublicVerifier } from '../../shared/infra/paseto-v4-public.js'
import { createServiceToken } from '../infra/service-token.js'
import { createTestFixture } from './helpers.js'

test('mints a verifiable service token', async () => {
  const key = await createTestFixture()
  const token = await createServiceToken({ SERVICE_PASETO_SECRET: key.secretKeyStr })
  assert.ok(token)
  const pub = await importVerificationKey(key.publicKeyStr as `k4.public.${string}`)
  const claims = (await new PasetoV4PublicVerifier(pub).verify(token)) as Record<string, any>
  assert.equal(claims.iss, 'biseo')
  assert.equal(claims.aud, 'biseo-service')
  assert.equal(claims.purpose, 'service')
  assert.equal(claims.sub, 'biseo-worker')
  assert.equal(Date.parse(claims.exp) - Date.parse(claims.iat), 300_000)
})
