import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest } from './refresh-fixture.js'
import { seedTrusted } from './pin-seed.js'

test('IP removal between verification and rotation still prevents PIN refresh', async () => {
 const { env, db, token } = await refreshFixture('pin')
 await seedTrusted(db,'1.2.3.4')
 const revoked = { ...env, BISEO_DB: {
  prepare: db.prepare.bind(db),
  batch: async (stmts: any[]) => {
   await db.prepare('DELETE FROM trusted_ips').run()
   return db.batch(stmts)
  },
 } as any }
 assert.equal((await app.fetch(refreshRequest(token),revoked)).status,401)
 assert.equal(await db.prepare('SELECT generation FROM refresh_sessions').first('generation'),0)
})
