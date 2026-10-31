import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { pinEnv } from './pin-fixture.js'
import { HOST, IP, passwordCookie, postPin } from './pin-request.js'

function putPin(cookie: string, pin: unknown) {
  return new Request(`${HOST}/api/pin`, {
    method: 'PUT',
    headers: { Cookie: cookie, Origin: HOST, 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  })
}

test('strong session validates PIN format and can replace or clear it', async () => {
  const { env, db, password } = await pinEnv()
  await db
    .prepare('INSERT INTO trusted_ips(ip,note,created_at,created_by) VALUES(?,?,?,?)')
    .bind(IP, '', '2026-01-01', 'owner')
    .run()
  const cookie = await passwordCookie(env, password)

  assert.equal((await app.fetch(putPin(cookie, '12345'), env)).status, 400)
  assert.equal((await app.fetch(putPin(cookie, '654321'), env)).status, 200)
  assert.equal((await app.fetch(putPin(cookie, '123456'), env)).status, 200)
  assert.equal((await postPin(env, '123456')).status, 200)

  const del = await app.fetch(
    new Request(`${HOST}/api/pin`, { method: 'DELETE', headers: { Cookie: cookie, Origin: HOST } }),
    env,
  )
  assert.equal(del.status, 200)
  assert.equal((await postPin(env, '123456')).status, 401)
})
