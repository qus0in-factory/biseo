import { checkLoginOrigin } from '../test-util/pin-csrf-login.js';
import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../index.js';
import { pinEnv } from '../test-util/pin-fixture.js';
import { HOST, IP, passwordCookie, pinReq, postPin } from '../test-util/pin-request.js';
import { seedPin, seedTrusted } from '../test-util/pin-seed.js';
import { status } from '../test-util/pin-header-status.js';

test('PIN login and trust changes require an allowed Origin', async () => {
  const { env, db, password } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  await checkLoginOrigin(env)

  const cookie = await passwordCookie(env, password)
  const mutate = new Request(`${HOST}/api/trusted-ip`, {
    method: 'DELETE',
    headers: { Cookie: cookie, 'CF-Connecting-IP': IP },
  })
  assert.equal((await app.fetch(mutate, env)).status, 403)
  assert.equal(
    (await db.prepare('SELECT COUNT(*) AS n FROM trusted_ips').first<{ n: number }>())!.n,
    1,
  )
})

test('untrusted IP cannot use PIN even with the correct value', async () => {
  const { env, db } = await pinEnv()
  await seedPin(db)
  assert.equal((await postPin(env, '123456')).status, 401)
})

test('trusted IP with wrong PIN or no configured PIN is rejected', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  assert.equal((await postPin(env, '123456')).status, 401)
  await seedPin(db)
  assert.equal((await postPin(env, '000000')).status, 401)
})

test('X-Forwarded-For never grants trust', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const req = pinReq('123456', '198.51.100.4')
  req.headers.set('X-Forwarded-For', IP)
  assert.equal((await app.fetch(req, env)).status, 401)
})

test('global failures across trusted IPs lock every IP', async () => {
  const { env, db, password } = await pinEnv({ PIN_GLOBAL_MAX_ATTEMPTS: '3' })
  const ips = ['203.0.113.1', '203.0.113.2', '203.0.113.3', '203.0.113.4']
  for (const ip of ips) await seedTrusted(db, ip)
  await seedPin(db)

  assert.equal((await postPin(env, '000000', ips[0])).status, 401)
  assert.equal((await postPin(env, '000000', ips[1])).status, 401)
  assert.equal((await postPin(env, '000000', ips[2])).status, 429)
  assert.equal((await postPin(env, '123456', ips[3])).status, 429)

  await passwordCookie(env, password)
  assert.equal((await postPin(env, '123456', ips[3])).status, 200)
})

test('missing, ambiguous, port, and private client IPs fail closed', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  assert.equal((await app.fetch(pinReq('123456', null), env)).status, 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': `${IP}, 198.51.100.4` }), 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': `${IP}:443` }), 403)
  assert.equal(await status(env, { 'CF-Connecting-IP': '10.0.0.1' }), 403)
})

test('five failures lock the IP; password success unlocks it', async () => {
  const { env, db, password } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  for (let i = 0; i < 4; i++) assert.equal((await postPin(env, '000000')).status, 401)
  assert.equal((await postPin(env, '000000')).status, 429)
  assert.equal((await postPin(env, '123456')).status, 429)

  const cookie = await passwordCookie(env, password)
  assert.match(cookie, /biseo_session=/)
  assert.equal((await postPin(env, '123456')).status, 200)
})

test('trusted IP + correct PIN logs in with a restricted session', async () => {
  const { env, db } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const res = await postPin(env, '123456')
  assert.equal(res.status, 200)
  const sc = res.headers.get('set-cookie')!
  assert.match(sc, /HttpOnly/)
  assert.match(sc, /Max-Age=900/)
  const cookie = sc.split(';')[0]
  const ses = await app.fetch(new Request(`${HOST}/api/session`, { headers: { Cookie: cookie } }), env)
  assert.equal(ses.status, 200)
  const manage = await app.fetch(
    new Request(`${HOST}/api/trusted-ip`, {
      method: 'POST',
      headers: { Cookie: cookie, Origin: HOST },
    }),
    env,
  )
  assert.equal(manage.status, 403)
})
