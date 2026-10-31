import { configurePin } from './pin-revoke-status.js'
import { checkTrustedStatus } from './pin-revoke-status.js'
import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { adminReq } from './pin-admin-req.js'
import { pinEnv } from './pin-fixture.js'
import { passwordCookie, postPin } from './pin-request.js'

test('trusted toggle and PIN setup work, and removal blocks the next PIN attempt', async () => {
  const { env, db, password } = await pinEnv()
  const cookie = await passwordCookie(env, password)

  await configurePin(env, cookie)
  await checkTrustedStatus(env, cookie)
  assert.equal((await postPin(env, '123456')).status, 200)

  assert.equal((await app.fetch(adminReq('/api/trusted-ip', cookie, 'DELETE'), env)).status, 200)
  assert.equal((await postPin(env, '123456')).status, 401)
  const row = await db.prepare('SELECT COUNT(*) AS n FROM trusted_ips').first<{ n: number }>()
  assert.equal(row!.n, 0)
})
