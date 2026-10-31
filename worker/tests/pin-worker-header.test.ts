import assert from 'node:assert/strict'
import test from 'node:test'
import { pinEnv } from './pin-fixture.js'
import { IP } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'
import { status } from './pin-header-status.js'

test('workers.dev and internal worker calls cannot reach the PIN path', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  assert.equal(await status(env, { 'CF-Connecting-IP': IP }, 'https://biseo.qus0in.workers.dev/api/login/pin'), 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': IP, 'CF-Worker': 'biseo.qus0in.dev' }), 403)
})
