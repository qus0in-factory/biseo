import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest, refreshToken, origin } from './refresh-fixture.js'
import { seedTrusted } from './pin-seed.js'

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
