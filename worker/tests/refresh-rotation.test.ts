import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest, refreshToken } from './refresh-fixture.js'

test('rotation persists hashed history; replay revokes the successor', async () => {
 const { env, db, token } = await refreshFixture()
 const first = await app.fetch(refreshRequest(token),env)
 assert.equal(first.status,200)
 const next = refreshToken(first)
 assert.notEqual(next,token)
 const rows = await db.prepare('SELECT * FROM refresh_tokens').all()
 assert.equal(rows.results.length,2)
 assert.ok(!JSON.stringify(rows).includes(token))
 assert.equal((await app.fetch(refreshRequest(token),env)).status,401)
 assert.equal((await app.fetch(refreshRequest(next),env)).status,401)
})
