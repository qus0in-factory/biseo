import assert from 'node:assert/strict'
import test from 'node:test'
import { createServiceToken } from '../infra/service-token.js'
import { createTestFixture } from './helpers.js'

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
