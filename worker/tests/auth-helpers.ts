import app from '../index.js'
import { createTestFixture } from './helpers.js'
import { createMockKv } from './kv-helpers.js'
import { createFakeD1 } from './fake-d1.js'

export async function loginAndGetCookie(env: any, password: string) {
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '127.0.0.1' },
    body: JSON.stringify({ password }),
  })
  const res = await app.fetch(req, env)
  return res.headers.get('set-cookie')!.split(';')[0]
}

export async function createAuthedEnv() {
  const { password, stored, secretKeyStr } = await createTestFixture()
  const env = {
    AUTH_PASSWORD_VERIFIER: stored,
    USER_SESSION_PASETO_SECRET: secretKeyStr,
    LOGIN_ATTEMPTS: createMockKv(),
    BISEO_DB: createFakeD1(),
  }
  const cookie = await loginAndGetCookie(env, password)
  return { env, cookie, password, stored, secretKeyStr }
}
