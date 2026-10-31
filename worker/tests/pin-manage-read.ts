import assert from 'node:assert/strict'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
type Env = Awaited<ReturnType<typeof pinEnv>>['env']
import { HOST } from './pin-request.js'
export async function checkRead(env: Env, cookie: string) {
  const get = await app.fetch(
    new Request(`${HOST}/api/trusted-ip`, { headers: { Cookie: cookie } }),
    env,
  )
  assert.equal(get.status, 200)
  const body = (await get.json()) as { canManage: boolean }
  assert.equal(body.canManage, false)

}
