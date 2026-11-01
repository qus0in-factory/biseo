import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest } from './refresh-fixture.js'

test('expiry during DB latency is checked again at the atomic write', async () => {
 const { env, db, token } = await refreshFixture()
 const delayed = { ...env, BISEO_DB: {
  prepare: db.prepare.bind(db),
  batch: async (stmts: any[]) => {
   await db.prepare('UPDATE refresh_sessions SET expires=unixepoch()-1').run()
   return db.batch(stmts)
  },
 } as any }
 const r = await app.fetch(refreshRequest(token),delayed)
 assert.equal(r.status,401)
 assert.equal(r.headers.get('set-cookie'),null)
 assert.equal(await db.prepare('SELECT generation FROM refresh_sessions').first('generation'),0)
})
