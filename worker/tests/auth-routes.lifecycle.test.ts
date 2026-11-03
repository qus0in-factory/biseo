import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createTestFixture } from '../test-util/helpers.js';
import { createMockKv } from '../test-util/kv-helpers.js';
import { hashIp } from '../infra/ip-hash.js';
import { createAuthedEnv } from '../test-util/auth-helpers.js';

test('blocks at threshold (KV eventual consistency allows minor overage)', async () => {
  const { password, stored, secretKeyStr } = await createTestFixture()
  const mockKv = createMockKv()
  const ip = '10.0.0.1'
  const key = await hashIp(ip)
  mockKv.map.set(key, '5')
  const env = {
    AUTH_PASSWORD_VERIFIER: stored,
    USER_SESSION_PASETO_SECRET: secretKeyStr,
    LOGIN_ATTEMPTS: mockKv,
  }
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
    body: JSON.stringify({ password }),
  })
  const res = await app.fetch(req, env)
  assert.equal(res.status, 429)
  assert.deepEqual(await res.json(), { error: 'rate_limit_exceeded' })
})

function loginReq() {
  return new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '127.0.0.1' },
    body: JSON.stringify({ password: 'any' }),
  })
}

test('POST /api/login fails-closed on missing limiter binding', async () => {
  const res = await app.fetch(loginReq(), {})
  assert.equal(res.status, 500)
  assert.deepEqual(await res.json(), { error: 'misconfigured' })
})

test('POST /api/login fails-closed on missing secret', async () => {
  const res = await app.fetch(loginReq(), { LOGIN_ATTEMPTS: createMockKv() })
  assert.equal(res.status, 500)
  assert.deepEqual(await res.json(), { error: 'misconfigured' })
})

test('GET /api/session succeeds with cookie and fails without', async () => {
  const { env, cookie } = await createAuthedEnv()
  const unauthRes = await app.fetch(new Request('http://localhost/api/session'), env)
  assert.equal(unauthRes.status, 401)
  assert.deepEqual(await unauthRes.json(), { error: 'unauthorized' })

  const authReq = new Request('http://localhost/api/session', {
    headers: { Cookie: cookie },
  })
  const authRes = await app.fetch(authReq, env)
  assert.equal(authRes.status, 200)
  const { expiresAt, ...body } = await authRes.json() as any
  assert.deepEqual(body, { ok: true, subject: 'owner' })
  assert.ok(Date.parse(expiresAt) > Date.now())
  assert.equal(authRes.headers.get('cache-control'), 'no-store')
})
