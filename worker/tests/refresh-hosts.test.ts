import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest, origin } from './refresh-fixture.js'

test('host-only refresh cookie cannot authenticate on the other allowed host', async () => {
 const { env, token } = await refreshFixture()
 const other = 'https://biseo.qus0in.workers.dev'
 env.ALLOWED_ORIGINS = `${origin},${other}`
 assert.equal((await app.fetch(refreshRequest(token,'/api/refresh',other),env)).status,401)
 const r = await app.fetch(refreshRequest(token),env)
 assert.equal(r.status,200)
 const cookie = r.headers.getSetCookie().find(v => v.startsWith('__Secure-'))!
 for (const flag of ['HttpOnly','Secure','SameSite=Strict','Path=/api']) assert.ok(cookie.includes(flag))
 assert.ok(!cookie.includes('Domain='))
})
