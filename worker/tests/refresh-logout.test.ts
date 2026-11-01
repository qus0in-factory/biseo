import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest, refreshToken } from './refresh-fixture.js'

test('logout with a previous cookie revokes a concurrently rotated family', async () => {
 const { env, token } = await refreshFixture()
 const r = await app.fetch(refreshRequest(token),env)
 const next = refreshToken(r)
 const logout = await app.fetch(refreshRequest(token,'/api/logout'),env)
 assert.equal(logout.status,200)
 assert.equal((await app.fetch(refreshRequest(next),env)).status,401)
 assert.equal((await app.fetch(refreshRequest(token),env)).status,401)
 assert.ok(logout.headers.getSetCookie().every(v => v.includes('Max-Age=0')))
})
