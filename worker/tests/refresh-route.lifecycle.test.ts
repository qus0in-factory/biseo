import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../index.js';
import { origin, refreshFixture, refreshRequest, refreshToken } from '../test-util/refresh-fixture.js';
import { startRefresh } from '../app/refresh-start.js';
import { refreshSource } from '../infra/refresh-source.js';
import { refreshPolicy } from '../ui/refresh-policy.js';
import { seedTrusted } from '../test-util/pin-seed.js';

test('PIN refresh is denied on workers.dev even with a valid host-bound family', async () => {
 const { env, db } = await refreshFixture()
 const host = 'https://biseo.qus0in.workers.dev'
 env.ALLOWED_ORIGINS = `${origin},${host}`
 await seedTrusted(db,'1.2.3.4')
 const r = await startRefresh(refreshSource(db as any),refreshPolicy(env),new URL(host).host,'owner','pin',900)
 assert.equal((await app.fetch(refreshRequest(r.token,'/api/refresh',host),env)).status,401)
})

test('PIN retains restricted claims and cannot extend the initial deadline', async () => {
 const { env, db, token } = await refreshFixture('pin')
 await seedTrusted(db,'1.2.3.4')
 const before = await db.prepare('SELECT expires FROM refresh_sessions').first('expires')
 const r = await app.fetch(refreshRequest(token),env)
 assert.equal(r.status,200)
 assert.equal(await db.prepare('SELECT expires FROM refresh_sessions').first('expires'),before)
 const access = r.headers.getSetCookie()[0].split(';')[0]
 const denied = await app.fetch(new Request(origin+'/api/trusted-ip', {
  method:'POST', headers:{Origin:origin,Cookie:access,'CF-Connecting-IP':'1.2.3.4'},
 }),env)
 assert.equal(denied.status,403)
})

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

test('worker restart needs no in-memory session state', async () => {
 const { env, token } = await refreshFixture()
 const first = await app.fetch(refreshRequest(token),env)
 assert.equal(first.status,200)
 const restarted = await import(new URL('../index.js?restart',import.meta.url).href)
 const second = await restarted.default.fetch(refreshRequest(refreshToken(first)),{...env})
 assert.equal(second.status,200)
})

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
