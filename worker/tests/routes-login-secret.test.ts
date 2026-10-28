import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createMockKv } from './kv-helpers.js'

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
