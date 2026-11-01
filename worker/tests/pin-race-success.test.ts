import assert from 'node:assert/strict'
import test from 'node:test'
import { pinEnv } from './pin-fixture.js'
import { postPin } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('success cannot clear failures accumulated by other IPs', async () => {
  const { env, db } = await pinEnv({ PIN_GLOBAL_MAX_ATTEMPTS: '3' })
  const ips = ['203.0.113.1', '203.0.113.2', '203.0.113.3']
  for (const ip of ips) await seedTrusted(db, ip)
  await seedPin(db)
  assert.equal((await postPin(env, '000000', ips[0])).status, 401)
  assert.equal((await postPin(env, '123456', ips[1])).status, 200)
  assert.equal((await postPin(env, '000000', ips[1])).status, 401)
  assert.equal((await postPin(env, '000000', ips[2])).status, 429)
})
