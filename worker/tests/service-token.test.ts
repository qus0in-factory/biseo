import assert from 'node:assert/strict'
import test from 'node:test'
import { importVerificationKey } from '../../shared/infra/paserk.js'
import { PasetoV4PublicVerifier } from '../../shared/infra/paseto-v4-public.js'
import { createServiceToken } from '../infra/service-token.js'
import { createTestFixture } from '../test-util/helpers.js'

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

test('does not verify with the user-session key', async () => {
  const user = await createTestFixture()
  const service = await createTestFixture()
  const token = await createServiceToken({ SERVICE_PASETO_SECRET: service.secretKeyStr })
  assert.ok(token)
  const pub = await importVerificationKey(user.publicKeyStr as `k4.public.${string}`)
  await assert.rejects(new PasetoV4PublicVerifier(pub).verify(token))
})

test('fails closed without a usable service key', async () => {
  assert.equal(await createServiceToken({}), null)
  assert.equal(await createServiceToken({ SERVICE_PASETO_SECRET: 'bad' }), null)
  const key = await createTestFixture()
  const env = { SERVICE_PASETO_SECRET: key.secretKeyStr, SERVICE_TOKEN_TTL_SECONDS: '301' }
  assert.equal(await createServiceToken(env), null)
  const reused = { SERVICE_PASETO_SECRET: key.secretKeyStr, USER_SESSION_PASETO_SECRET: key.secretKeyStr }
  assert.equal(await createServiceToken(reused), null)
  const sameAud = { SERVICE_PASETO_SECRET: key.secretKeyStr, TOKEN_AUDIENCE: 'same', SERVICE_TOKEN_AUDIENCE: 'same' }
  assert.equal(await createServiceToken(sameAud), null)
})
