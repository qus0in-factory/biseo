import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
import { HOST, IP, pinReq } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

async function status(env: any, headers: Record<string, string>, url = `${HOST}/api/login/pin`) {
  const req = new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: new URL(url).origin, ...headers },
    body: JSON.stringify({ pin: '123456' }),
  })
  return (await app.fetch(req, env)).status
}

test('missing, ambiguous, port, and private client IPs fail closed', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  assert.equal((await app.fetch(pinReq('123456', null), env)).status, 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': `${IP}, 198.51.100.4` }), 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': `${IP}:443` }), 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': '10.0.0.1' }), 403)
})

test('workers.dev and internal worker calls cannot reach the PIN path', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  assert.equal(await status(env, { 'CF-Connecting-IP': IP }, 'https://biseo.qus0in.workers.dev/api/login/pin'), 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': IP, 'CF-Worker': 'biseo.qus0in.dev' }), 403)
})
