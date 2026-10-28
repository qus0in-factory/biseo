import assert from 'node:assert/strict'
import test from 'node:test'
import { importVerificationKey } from '../../shared/infra/paserk.js'
import { PasetoV4PublicVerifier } from '../../shared/infra/paseto-v4-public.js'
import { createServiceToken } from '../infra/service-token.js'
import { createTestFixture } from './helpers.js'

test('does not verify with the user-session key', async () => {
  const user = await createTestFixture()
  const service = await createTestFixture()
  const token = await createServiceToken({ SERVICE_PASETO_SECRET: service.secretKeyStr })
  assert.ok(token)
  const pub = await importVerificationKey(user.publicKeyStr as `k4.public.${string}`)
  await assert.rejects(new PasetoV4PublicVerifier(pub).verify(token))
})
