import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest } from './refresh-fixture.js'

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
