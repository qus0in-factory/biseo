import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest } from './refresh-fixture.js'

test('failed successor insertion rolls back consumption of the previous token', async () => {
 const { env, db, token } = await refreshFixture()
 const broken = { ...env, BISEO_DB: {
  prepare: db.prepare.bind(db),
  batch: (stmts: any[]) => db.batch([...stmts,db.prepare('SELECT * FROM missing_table')]),
 } as any }
 const r = await app.fetch(refreshRequest(token),broken)
 assert.equal(r.status,503)
 assert.equal(await db.prepare('SELECT generation FROM refresh_sessions').first('generation'),0)
 assert.equal((await app.fetch(refreshRequest(token),env)).status,200)
})
