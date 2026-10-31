import { checkRead } from './pin-manage-read.js'
import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { adminReq } from './pin-admin-req.js'
import { pinEnv } from './pin-fixture.js'
import { IP, postPin } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('PIN session can read status but cannot change trust or PIN', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const res = await postPin(env, '123456')
  const cookie = res.headers.get('set-cookie')!.split(';')[0]

  await checkRead(env, cookie)

  for (const [method, path] of [
    ['POST', '/api/trusted-ip'],
    ['DELETE', '/api/trusted-ip'],
    ['PUT', '/api/pin'],
    ['DELETE', '/api/pin'],
  ]) {
    assert.equal((await app.fetch(adminReq(path, cookie, method), env)).status, 403, method + path)
  }
})
