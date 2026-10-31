import assert from 'node:assert/strict'
import test from 'node:test'
import { pinEnv } from './pin-fixture.js'
import { IP, passwordCookie, postPin } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('five failures lock the IP; password success unlocks it', async () => {
  const { env, db, password } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  for (let i = 0; i < 4; i++) assert.equal((await postPin(env, '000000')).status, 401)
  assert.equal((await postPin(env, '000000')).status, 429)
  assert.equal((await postPin(env, '123456')).status, 429)

  const cookie = await passwordCookie(env, password)
  assert.match(cookie, /biseo_session=/)
  assert.equal((await postPin(env, '123456')).status, 200)
})
