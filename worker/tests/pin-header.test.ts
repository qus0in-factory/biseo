import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
import { IP, pinReq } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

import { status } from './pin-header-status.js'

test('missing, ambiguous, port, and private client IPs fail closed', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  assert.equal((await app.fetch(pinReq('123456', null), env)).status, 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': `${IP}, 198.51.100.4` }), 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': `${IP}:443` }), 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': '10.0.0.1' }), 403)
})
