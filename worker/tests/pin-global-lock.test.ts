import assert from 'node:assert/strict'
import test from 'node:test'
import { pinEnv } from './pin-fixture.js'
import { passwordCookie, postPin } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('global failures across trusted IPs lock every IP', async () => {
  const { env, db, password } = await pinEnv({ PIN_GLOBAL_MAX_ATTEMPTS: '3' })
  const ips = ['203.0.113.1', '203.0.113.2', '203.0.113.3', '203.0.113.4']
  for (const ip of ips) await seedTrusted(db, ip)
  await seedPin(db)

  assert.equal((await postPin(env, '000000', ips[0])).status, 401)
  assert.equal((await postPin(env, '000000', ips[1])).status, 401)
  assert.equal((await postPin(env, '000000', ips[2])).status, 429)
  assert.equal((await postPin(env, '123456', ips[3])).status, 429)

  await passwordCookie(env, password)
  assert.equal((await postPin(env, '123456', ips[3])).status, 200)
})
