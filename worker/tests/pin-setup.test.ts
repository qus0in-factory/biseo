import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
import { IP, passwordCookie, postPin } from './pin-request.js'

import { seedTrusted } from './pin-seed.js'
import { deletePin, putPin } from './pin-put-request.js'

test('strong session validates PIN format and can replace or clear it', async () => {
  const { env, db, password } = await pinEnv()
  await seedTrusted(db, IP)
  const cookie = await passwordCookie(env, password)

  assert.equal((await app.fetch(putPin(cookie, '12345'), env)).status, 400)
  assert.equal((await app.fetch(putPin(cookie, '654321'), env)).status, 200)
  assert.equal((await app.fetch(putPin(cookie, '123456'), env)).status, 200)
  assert.equal((await postPin(env, '123456')).status, 200)

  const del = await app.fetch(deletePin(cookie), env)
  assert.equal(del.status, 200)
  assert.equal((await postPin(env, '123456')).status, 401)
})
