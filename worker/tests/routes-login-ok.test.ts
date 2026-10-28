import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTestFixture, mockPassRateLimiter } from './helpers.js'

test('POST /api/login succeeds with valid password and sets cookie', async () => {
  const { password, stored, secretKeyStr } = await createTestFixture()
  const env = {
    AUTH_PASSWORD_VERIFIER: stored,
    USER_SESSION_PASETO_SECRET: secretKeyStr,
    LOGIN_RATE_LIMITER: mockPassRateLimiter,
  }
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '127.0.0.1' },
    body: JSON.stringify({ password }),
  })
  const res = await app.fetch(req, env)
  assert.equal(res.status, 200)
  const sc = res.headers.get('set-cookie') || ''
  assert.match(sc, /biseo_session=v4\.public\./)
  assert.match(sc, /HttpOnly/i)
  assert.match(sc, /Secure/i)
  assert.match(sc, /SameSite=Lax/i)
  assert.match(sc, /Path=\//i)
  assert.match(sc, /Max-Age=3600/i)
})
