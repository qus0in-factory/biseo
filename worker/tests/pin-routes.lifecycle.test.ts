import { checkRead } from '../test-util/pin-manage-read.js';
import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { adminReq } from '../test-util/pin-admin-req.js';
import { pinEnv } from '../test-util/pin-fixture.js';
import { IP, postPin } from '../test-util/pin-request.js';
import { seedPin, seedTrusted } from '../test-util/pin-seed.js';
import { PIN_PREFERRED_URL, pinPreferredBody, pinPreferredReq } from '../test-util/pin-preferred-request.js';
import { pinLogin } from '../app/pin-login.js';
import { createPinDeps } from '../ui/pin-deps.js';

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

test('parallel wrong PINs never succeed and still lock the IP', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const results = await Promise.all(
    Array.from({ length: 12 }, () => postPin(env, '000000')),
  )
  const codes = results.map((r) => r.status)
  assert.equal(codes.includes(200), false)
  assert.ok(codes.includes(429))
  const row = await db
    .prepare('SELECT locked_until FROM pin_attempts WHERE scope=?')
    .bind(`ip:${IP}`)
    .first<{ locked_until: number }>()
  assert.ok(row && row.locked_until > 0)
})

test('untrusted IP and workers.dev never prefer PIN', async () => {
  const { env, db } = await pinEnv({
    PIN_ALLOWED_HOSTS: 'biseo.qus0in.dev,biseo.qus0in.workers.dev',
  })
  await seedTrusted(db, IP)
  await seedPin(db)
  const workers = 'https://biseo.qus0in.workers.dev/api/login/pin-preferred'
  assert.equal((await pinPreferredBody(await pinPreferredReq(env, IP, workers))).pinPreferred, false)
  assert.equal((await pinPreferredBody(await pinPreferredReq(env, '198.51.100.9'))).pinPreferred, false)
  assert.equal((await pinPreferredBody(await pinPreferredReq(env, null))).pinPreferred, false)
})

test('internal calls and storage failures fail closed', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const internal = new Request(PIN_PREFERRED_URL, {
    headers: { 'CF-Connecting-IP': IP, 'CF-Worker': 'internal' },
  })
  assert.equal((await pinPreferredBody(await app.fetch(internal, env))).pinPreferred, false)
  const noDb = { ...env, BISEO_DB: undefined }
  assert.equal((await pinPreferredBody(await pinPreferredReq(noDb))).pinPreferred, false)
})

test('only a trusted IP with a configured PIN prefers PIN', async () => {
  const { env, db } = await pinEnv()
  assert.equal((await pinPreferredBody(await pinPreferredReq(env))).pinPreferred, false)
  await seedTrusted(db, IP)
  assert.equal((await pinPreferredBody(await pinPreferredReq(env))).pinPreferred, false)
  await seedPin(db)
  const r = await pinPreferredReq(env)
  assert.deepEqual(await pinPreferredBody(r), { pinPreferred: true })
  assert.equal(r.headers.get('cache-control'), 'no-store')
})

test('parallel attempts reserve before PIN verification', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const deps = (await createPinDeps(env, IP))!
  let started = 0
  let release!: () => void
  const gate = new Promise<void>(r => { release = r })
  deps.verifier = { async verify() { started++; await gate; return false } }
  const requests = Array.from({ length: 12 }, () => pinLogin(deps, '000000'))
  await new Promise(resolve => setTimeout(resolve, 50))
  try { assert.equal(started, 5) } finally { release() }
  await Promise.all(requests)
})

test('parallel successful PINs also reserve before verification', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const deps = (await createPinDeps(env, IP))!
  let started = 0
  let release!: () => void
  const gate = new Promise<void>(r => { release = r })
  deps.verifier = { async verify() { started++; await gate; return true } }
  const requests = Array.from({ length: 12 }, () => pinLogin(deps, '123456'))
  await new Promise(resolve => setTimeout(resolve, 50))
  try { assert.equal(started, 5) } finally { release() }
  await Promise.all(requests)
})
