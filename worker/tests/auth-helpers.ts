import app from '../index.js'
import { createTestFixture } from './helpers.js'

export async function loginAndGetCookie(env: any, password: string) {
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  }
  const cookie = await loginAndGetCookie(env, password)
  return { env, cookie, password, stored, secretKeyStr }
}
