import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
import { HOST, IP, passwordCookie } from './pin-request.js'
import { seedPin, seedTrusted } from './pin-seed.js'

test('PIN login and trust changes require an allowed Origin', async () => {
  const { env, db, password } = await pinEnv()
  await seedTrusted(db, IP)
  await seedPin(db)
  const noOrigin = new Request(`${HOST}/api/login/pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': IP },
    body: JSON.stringify({ pin: '123456' }),
  })
  assert.equal((await app.fetch(noOrigin, env)).status, 403)

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
