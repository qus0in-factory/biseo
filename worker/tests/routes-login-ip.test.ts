import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTestFixture } from './helpers.js'

test('POST /api/login fails-closed with 429 when cf-connecting-ip is missing', async () => {
  const { password, stored, secretKeyStr } = await createTestFixture()
  let limitCalled = false
  const mockLimiter = {
    limit: async () => {
      limitCalled = true
      return { success: true }
    },
  }
  const env = {
    AUTH_PASSWORD_VERIFIER: stored,
    USER_SESSION_PASETO_SECRET: secretKeyStr,
    LOGIN_RATE_LIMITER: mockLimiter,
  }
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  const res = await app.fetch(req, env)
  assert.equal(res.status, 429)
  assert.deepEqual(await res.json(), { error: 'rate_limit_exceeded' })
  assert.equal(limitCalled, false)
})
