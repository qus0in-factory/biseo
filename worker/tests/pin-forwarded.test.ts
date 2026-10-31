import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
import { IP, pinReq } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('X-Forwarded-For never grants trust', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const req = pinReq('123456', '198.51.100.4')
  req.headers.set('X-Forwarded-For', IP)
  assert.equal((await app.fetch(req, env)).status, 401)
})
