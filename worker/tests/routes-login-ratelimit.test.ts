import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTestFixture } from './helpers.js'

test('POST /api/login returns 429 when rate limit is exceeded', async () => {
  const { password, stored, secretKeyStr } = await createTestFixture()
  let checkedKey = ''
  const mockLimiter = {
    limit: async ({ key }: { key: string }) => {
      checkedKey = key
      return { success: false }
    },
  }
  const env = {
    AUTH_PASSWORD_VERIFIER: stored,
    USER_SESSION_PASETO_SECRET: secretKeyStr,
    LOGIN_RATE_LIMITER: mockLimiter,
  }
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CF-Connecting-IP': '203.0.113.195',
    },
    body: JSON.stringify({ password }),
  })
  const res = await app.fetch(req, env)
  assert.equal(res.status, 429)
  assert.deepEqual(await res.json(), { error: 'rate_limit_exceeded' })
  assert.equal(checkedKey, '203.0.113.195')
})
