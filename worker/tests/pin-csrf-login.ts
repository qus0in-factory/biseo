import assert from 'node:assert/strict'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
type Env = Awaited<ReturnType<typeof pinEnv>>['env']
import { HOST, IP } from './pin-request.js'
export async function checkLoginOrigin(env: Env) {
  const noOrigin = new Request(`${HOST}/api/login/pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': IP },
    body: JSON.stringify({ pin: '123456' }),
  })
  assert.equal((await app.fetch(noOrigin, env)).status, 403)

}
