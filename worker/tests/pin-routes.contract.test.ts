import assert from 'node:assert/strict';
import test from 'node:test';
import { pinEnv } from '../test-util/pin-fixture.js';
import { HOST, IP, passwordCookie, postPin } from '../test-util/pin-request.js';
import { seedPin, seedTrusted } from '../test-util/pin-seed.js';
import { checkTrustedStatus, configurePin } from '../test-util/pin-revoke-status.js';
import app from '../index.js';
import { adminReq } from '../test-util/pin-admin-req.js';
import { deletePin, putPin } from '../test-util/pin-put-request.js';
import { status } from '../test-util/pin-header-status.js';

test('success cannot clear failures accumulated by other IPs', async () => {
  const { env, db } = await pinEnv({ PIN_GLOBAL_MAX_ATTEMPTS: '3' })
  const ips = ['203.0.113.1', '203.0.113.2', '203.0.113.3']
  for (const ip of ips) await seedTrusted(db, ip)
  await seedPin(db)
  assert.equal((await postPin(env, '000000', ips[0])).status, 401)
  assert.equal((await postPin(env, '123456', ips[1])).status, 200)
  assert.equal((await postPin(env, '000000', ips[1])).status, 401)
  assert.equal((await postPin(env, '000000', ips[2])).status, 429)
})

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

test('password failure does not consume or block the PIN counter', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const bad = await app.fetch(
    new Request(`${HOST}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': IP },
      body: JSON.stringify({ password: 'wrong-password' }),
    }),
    env,
  )
  assert.equal(bad.status, 401)
  assert.equal((await postPin(env, '123456')).status, 200)
})

test('PIN login bypasses authenticated selected workspace resolution',async()=>{
 const{env,db}=await pinEnv({WORKSPACE_CONFIG_SOURCE:'server'})
 await seedTrusted(db,IP)
 await seedPin(db)
 const f=globalThis.fetch
 let calls=0
 globalThis.fetch=async()=>{calls++;throw new Error('unexpected workspace lookup')}
 try{
  assert.equal((await postPin(env,'123456')).status,200)
  assert.equal(calls,0)
 }finally{globalThis.fetch=f}
})

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

test('workers.dev and internal worker calls cannot reach the PIN path', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  assert.equal(await status(env, { 'CF-Connecting-IP': IP }, 'https://biseo.qus0in.workers.dev/api/login/pin'), 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': IP, 'CF-Worker': 'biseo.qus0in.dev' }), 403)
})
