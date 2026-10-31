import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { adminReq } from './pin-admin-req.js'
import { pinEnv } from './pin-fixture.js'
import { IP, passwordCookie, postPin } from './pin-request.js'

test('trusted toggle and PIN setup work, and removal blocks the next PIN attempt', async () => {
  const { env, db, password } = await pinEnv()
  const cookie = await passwordCookie(env, password)

  assert.equal((await app.fetch(adminReq('/api/trusted-ip', cookie, 'POST'), env)).status, 200)
  assert.equal(
    (await app.fetch(adminReq('/api/pin', cookie, 'PUT', { pin: '123456' }), env)).status,
    200,
  )
  const status = await app.fetch(adminReq('/api/trusted-ip', cookie), env)
  assert.deepEqual(await status.json(), {
    ip: IP,
    trusted: true,
    available: true,
    canManage: true,
    pinConfigured: true,
  })
  assert.equal((await postPin(env, '123456')).status, 200)

  assert.equal((await app.fetch(adminReq('/api/trusted-ip', cookie, 'DELETE'), env)).status, 200)
  assert.equal((await postPin(env, '123456')).status, 401)
  const row = await db.prepare('SELECT COUNT(*) AS n FROM trusted_ips').first<{ n: number }>()
  assert.equal(row!.n, 0)
})
