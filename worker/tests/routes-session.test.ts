import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createAuthedEnv } from './auth-helpers.js'

test('GET /api/session succeeds with cookie and fails without', async () => {
  const { env, cookie } = await createAuthedEnv()
  const unauthRes = await app.fetch(new Request('http://localhost/api/session'), env)
  assert.equal(unauthRes.status, 401)
  assert.deepEqual(await unauthRes.json(), { error: 'unauthorized' })

  const authReq = new Request('http://localhost/api/session', {
    headers: { Cookie: cookie },
  })
  const authRes = await app.fetch(authReq, env)
  assert.equal(authRes.status, 200)
  const { expiresAt, ...body } = await authRes.json() as any
  assert.deepEqual(body, { ok: true, subject: 'owner' })
  assert.ok(Date.parse(expiresAt) > Date.now())
  assert.equal(authRes.headers.get('cache-control'), 'no-store')
})
