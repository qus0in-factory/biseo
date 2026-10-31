import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
import { HOST, IP, postPin } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

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
