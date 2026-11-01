import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest, refreshToken } from './refresh-fixture.js'

test('lost response cannot be recovered by replay; no grace at any delay', async () => {
 const { env, token } = await refreshFixture()
 const r = await app.fetch(refreshRequest(token),env)
 assert.equal(r.status,200)
 const next = refreshToken(r)
 assert.equal((await app.fetch(refreshRequest(token),env)).status,401)
 assert.equal((await app.fetch(refreshRequest(token),env)).status,401)
 assert.equal((await app.fetch(refreshRequest(next),env)).status,401)
})
