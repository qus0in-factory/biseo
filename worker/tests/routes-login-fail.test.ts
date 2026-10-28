import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTestFixture } from './helpers.js'
import { createMockKv } from './kv-helpers.js'

test('POST /api/login fails on wrong password', async () => {
  const { stored, secretKeyStr } = await createTestFixture()
  const mockKv = createMockKv()
  const env = {
    AUTH_PASSWORD_VERIFIER: stored,
    USER_SESSION_PASETO_SECRET: secretKeyStr,
    LOGIN_ATTEMPTS: mockKv,
  }
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '127.0.0.1' },
    body: JSON.stringify({ password: 'wrong' }),
  })
  const res = await app.fetch(req, env)
  assert.equal(res.status, 401)
  assert.equal(res.headers.get('set-cookie'), null)
  assert.deepEqual(await res.json(), { error: 'unauthorized' })
})
