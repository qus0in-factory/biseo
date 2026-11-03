import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { createTestFixture } from '../test-util/helpers.js';
import { createMockKv } from '../test-util/kv-helpers.js';
import { postLogin } from '../test-util/login-req-helper.js';
import { hashIp } from '../infra/ip-hash.js';
import { createFakeD1 } from '../test-util/fake-d1.js';

// KV eventual consistency allows minor overage
test('increments on fail, clears on success', async () => {
  const { password, stored, secretKeyStr } = await createTestFixture()
  const mockKv = createMockKv()
  const ip = '10.0.0.2'
  const key = await hashIp(ip)
  const env = {
    AUTH_PASSWORD_VERIFIER: stored,
    USER_SESSION_PASETO_SECRET: secretKeyStr,
    LOGIN_ATTEMPTS: mockKv,
    BISEO_DB: createFakeD1(),
  }
  assert.equal((await app.fetch(postLogin(env, ip, 'bad'), env)).status, 401)
  assert.equal(mockKv.map.get(key), '1')
  assert.equal((await app.fetch(postLogin(env, ip, password), env)).status, 200)
  assert.equal(mockKv.map.get(key), undefined)
})

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

test('POST /api/login fails-closed with 429 when cf-connecting-ip is missing', async () => {
  const { password, stored, secretKeyStr } = await createTestFixture()
  const mockKv = createMockKv()
  const env = {
    AUTH_PASSWORD_VERIFIER: stored,
    USER_SESSION_PASETO_SECRET: secretKeyStr,
    LOGIN_ATTEMPTS: mockKv,
  }
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  const res = await app.fetch(req, env)
  assert.equal(res.status, 429)
  assert.deepEqual(await res.json(), { error: 'rate_limit_exceeded' })
  assert.equal(mockKv.map.size, 0)
})

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
