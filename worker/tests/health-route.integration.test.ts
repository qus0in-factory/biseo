import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createAuthedEnv } from '../test-util/auth-helpers.js';
import { createTestFixture } from '../test-util/helpers.js';

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

test('does not call upstream when the service secret is missing', async () => {
  const { env, cookie } = await createAuthedEnv()
  const original = globalThis.fetch
  let called = false
  globalThis.fetch = (async () => {
    called = true
    return Response.json({})
  }) as typeof fetch
  try {
    const req = new Request('http://localhost/api/health', { headers: { Cookie: cookie } })
    const res = await app.fetch(req, {
      ...env,
      FUNNEL_HEALTH_URL: 'https://backend.test/health',
      HEALTH_TIMEOUT_MS: '1000',
    })
    assert.equal(res.status, 502)
    assert.deepEqual(await res.json(), { error: 'misconfigured' })
    assert.equal(called, false)
  } finally {
    globalThis.fetch = original
  }
})

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
