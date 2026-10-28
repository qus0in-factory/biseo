import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createAuthedEnv } from './auth-helpers.js'
import { createTestFixture } from './helpers.js'

test('attaches a service bearer token upstream', async () => {
  const { env, cookie } = await createAuthedEnv()
  const service = await createTestFixture()
  const original = globalThis.fetch
  let auth = ''
  globalThis.fetch = (async (input: any) => {
    auth = new Request(input).headers.get('authorization') ?? ''
    return Response.json({ status: 'ok' })
  }) as typeof fetch
  try {
    const req = new Request('http://localhost/api/health', { headers: { Cookie: cookie } })
    const res = await app.fetch(req, {
      ...env,
      FUNNEL_HEALTH_URL: 'https://backend.test/health',
      HEALTH_TIMEOUT_MS: '1000',
      SERVICE_PASETO_SECRET: service.secretKeyStr,
    })
    assert.equal(res.status, 200)
    assert.match(auth, /^Bearer v4\.public\./)
  } finally {
    globalThis.fetch = original
  }
})
