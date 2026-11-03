import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTestFixture } from '../test-util/helpers.js'
import { createMockKv } from '../test-util/kv-helpers.js'
import { postLogin } from '../test-util/login-req-helper.js'
import { hashIp } from '../infra/ip-hash.js'
import { createFakeD1 } from '../test-util/fake-d1.js'

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
