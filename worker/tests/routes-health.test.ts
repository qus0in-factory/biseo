import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createAuthedEnv } from './auth-helpers.js'
import { createTestFixture } from './helpers.js'

test('GET /api/health requires valid session before calling upstream', async () => {
  const { env, cookie } = await createAuthedEnv()
  const service = await createTestFixture()
  const unauthRes = await app.fetch(new Request('http://localhost/api/health'), env)
  assert.equal(unauthRes.status, 401)
  assert.deepEqual(await unauthRes.json(), { error: 'unauthorized' })

  const badUpstreamEnv = {
    ...env,
    SERVICE_PASETO_SECRET: service.secretKeyStr,
    FUNNEL_HEALTH_URL: 'http://upstream.invalid/health',
    HEALTH_TIMEOUT_MS: '1000',
  }
  const authRes = await app.fetch(
    new Request('http://localhost/api/health', { headers: { Cookie: cookie } }),
    badUpstreamEnv,
  )
  assert.equal(authRes.status, 502)
  assert.deepEqual(await authRes.json(), { error: 'bad_gateway' })
})
