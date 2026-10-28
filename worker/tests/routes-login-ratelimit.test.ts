import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTestFixture } from './helpers.js'
import { createMockKv } from './kv-helpers.js'
import { hashIp } from '../infra/ip-hash.js'

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
