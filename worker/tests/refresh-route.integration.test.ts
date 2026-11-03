import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../index.js';
import { origin, refreshFixture, refreshRequest, refreshToken } from '../test-util/refresh-fixture.js';

test('body tokens and malformed cookies cannot replace the HttpOnly refresh cookie', async () => {
 const { env, token } = await refreshFixture()
 const req = refreshRequest(token)
 req.headers.delete('Cookie')
 const body = new Request(req,{body:JSON.stringify({refreshToken:token})})
 assert.equal((await app.fetch(body,env)).status,401)
 assert.equal((await app.fetch(refreshRequest('invalid'),env)).status,401)
 const http = refreshRequest(token,'/api/refresh','http://biseo.qus0in.dev')
 assert.equal((await app.fetch(http,env)).status,403)
})

test('database failures are temporary, do not clear cookies or leak secrets', async () => {
 const { env, token } = await refreshFixture()
 const broken = { ...env, BISEO_DB: {
  prepare() { throw new Error(token) },
 } as any }
 for (const path of ['/api/refresh','/api/logout']) {
  const r = await app.fetch(refreshRequest(token,path),broken)
  assert.equal(r.status,503)
  assert.equal(r.headers.get('set-cookie'),null)
  assert.ok(!(await r.text()).includes(token))
 }
 assert.equal((await app.fetch(refreshRequest(token),env)).status,200)
})

for (const field of ['idle','expires','revoked']) {
 test(`${field} denies refresh without issuing cookies`, async () => {
  const { env, db, token } = await refreshFixture()
  await db.prepare(`UPDATE refresh_sessions SET ${field}=1`).run()
  const r = await app.fetch(refreshRequest(token),env)
  assert.equal(r.status,401)
  assert.equal(r.headers.get('set-cookie'),null)
 })
}

test('refresh/logout require exact Origin, CSRF header, HTTPS and configured host', async () => {
 const { env, token } = await refreshFixture()
 for (const path of ['/api/refresh','/api/logout']) {
  for (const header of ['origin','x-biseo-csrf']) {
   const r = refreshRequest(token,path)
   r.headers.delete(header)
   assert.equal((await app.fetch(r,env)).status,403)
  }
  const r = refreshRequest(token,path)
  r.headers.set('origin','https://biseo.qus0in.workers.dev')
  assert.equal((await app.fetch(r,env)).status,403)
  assert.equal((await app.fetch(refreshRequest(token,path,'https://evil.test'),env)).status,403)
 }
})

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

test('lost response cannot be recovered by replay; no grace at any delay', async () => {
 const { env, token } = await refreshFixture()
 const r = await app.fetch(refreshRequest(token),env)
 assert.equal(r.status,200)
 const next = refreshToken(r)
 assert.equal((await app.fetch(refreshRequest(token),env)).status,401)
 assert.equal((await app.fetch(refreshRequest(token),env)).status,401)
 assert.equal((await app.fetch(refreshRequest(next),env)).status,401)
})

test('uncoordinated concurrent requests produce exactly one successor and revoke on reuse', async () => {
 const { env, db, token } = await refreshFixture()
 const results = await Promise.all([1,2].map(() => app.fetch(refreshRequest(token),env)))
 assert.deepEqual(results.map(r => r.status).sort(),[200,401])
 const success = results.find(r => r.ok)!
 assert.equal((await app.fetch(refreshRequest(refreshToken(success)),env)).status,401)
 assert.equal(await db.prepare('SELECT count(*) n FROM refresh_tokens').first('n'),2)
})
