import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTestFixture } from './helpers.js'
import { createMockKv } from './kv-helpers.js'
import { postLogin } from './login-req-helper.js'
import { createFakeD1 } from './fake-d1.js'

test('POST /api/login succeeds with valid password and sets cookie', async () => {
  const { password, stored, secretKeyStr } = await createTestFixture()
  const env = {
    AUTH_PASSWORD_VERIFIER: stored,
    USER_SESSION_PASETO_SECRET: secretKeyStr,
    LOGIN_ATTEMPTS: createMockKv(),
    BISEO_DB: createFakeD1(),
  }
  const res = await app.fetch(postLogin(env, '127.0.0.1', password), env)
  assert.equal(res.status, 200)
  const sc = res.headers.get('set-cookie') || ''
  assert.match(sc, /biseo_session=v4\.public\./)
  assert.match(sc, /HttpOnly/i)
  assert.match(sc, /Secure/i)
  assert.match(sc, /SameSite=Lax/i)
  assert.match(sc, /Path=\//i)
  assert.match(sc, /Max-Age=3600/i)
})
