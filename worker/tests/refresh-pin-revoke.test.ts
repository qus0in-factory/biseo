import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest, refreshToken } from './refresh-fixture.js'
import { seedTrusted } from './pin-seed.js'

test('every PIN refresh rechecks trusted IP; rotation never creates trust', async () => {
 const { env, db, token } = await refreshFixture('pin')
 assert.equal((await app.fetch(refreshRequest(token),env)).status,401)
 await seedTrusted(db,'1.2.3.4')
 const r = await app.fetch(refreshRequest(token),env)
 assert.equal(r.status,200)
 await db.prepare('DELETE FROM trusted_ips').run()
 assert.equal((await app.fetch(refreshRequest(refreshToken(r)),env)).status,401)
 assert.equal(await db.prepare('SELECT count(*) n FROM trusted_ips').first('n'),0)
})
