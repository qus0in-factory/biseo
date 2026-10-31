import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
import { HOST, IP, pinReq, postPin } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('untrusted IP cannot use PIN even with the correct value', async () => {
  const { env, db } = await pinEnv()
  await seedPin(db)
  assert.equal((await postPin(env, '123456')).status, 401)
})

test('trusted IP with wrong PIN or no configured PIN is rejected', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  assert.equal((await postPin(env, '123456')).status, 401)
  await seedPin(db)
  assert.equal((await postPin(env, '000000')).status, 401)
})

test('X-Forwarded-For never grants trust', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const req = pinReq('123456', '198.51.100.4')
  req.headers.set('X-Forwarded-For', IP)
  assert.equal((await app.fetch(req, env)).status, 401)
})
