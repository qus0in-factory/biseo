import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTestFixture } from './helpers.js'

function throwingKv(): KVNamespace {
  const bomb = async () => { throw new Error('kv fail') }
  return { get: bomb, put: bomb, delete: bomb } as unknown as KVNamespace
}

test('POST /api/login fails-closed with 500 when KV throws', async () => {
  const { password, stored, secretKeyStr } = await createTestFixture()
  const env = {
    AUTH_PASSWORD_VERIFIER: stored,
    USER_SESSION_PASETO_SECRET: secretKeyStr,
    LOGIN_ATTEMPTS: throwingKv(),
  }
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '10.0.0.1' },
    body: JSON.stringify({ password }),
  })
  const res = await app.fetch(req, env)
  assert.equal(res.status, 500)
  assert.deepEqual(await res.json(), { error: 'misconfigured' })
})
