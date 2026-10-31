import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest, refreshToken } from './refresh-fixture.js'

test('uncoordinated concurrent requests produce exactly one successor and revoke on reuse', async () => {
 const { env, db, token } = await refreshFixture()
 const results = await Promise.all([1,2].map(() => app.fetch(refreshRequest(token),env)))
 assert.deepEqual(results.map(r => r.status).sort(),[200,401])
 const success = results.find(r => r.ok)!
 assert.equal((await app.fetch(refreshRequest(refreshToken(success)),env)).status,401)
 assert.equal(await db.prepare('SELECT count(*) n FROM refresh_tokens').first('n'),2)
})
