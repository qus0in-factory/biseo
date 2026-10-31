import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
import { HOST, IP, postPin } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('password failure does not consume or block the PIN counter', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const bad = await app.fetch(
    new Request(`${HOST}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': IP },
      body: JSON.stringify({ password: 'wrong-password' }),
    }),
    env,
  )
  assert.equal(bad.status, 401)
  assert.equal((await postPin(env, '123456')).status, 200)
})
