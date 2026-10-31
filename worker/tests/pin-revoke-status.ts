import assert from 'node:assert/strict'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
type Env = Awaited<ReturnType<typeof pinEnv>>['env']
import { adminReq } from './pin-admin-req.js'
import { IP } from './pin-request.js'
export async function checkTrustedStatus(env: Env, cookie: string) {
  const status = await app.fetch(adminReq('/api/trusted-ip', cookie), env)
  assert.deepEqual(await status.json(), {
    ip: IP,
    trusted: true,
    available: true,
    canManage: true,
    pinConfigured: true,
  })
}

export async function configurePin(env: Env, cookie: string) {
  assert.equal((await app.fetch(adminReq('/api/trusted-ip', cookie, 'POST'), env)).status, 200)
  assert.equal(
    (await app.fetch(adminReq('/api/pin', cookie, 'PUT', { pin: '123456' }), env)).status,
    200,
  )
}
