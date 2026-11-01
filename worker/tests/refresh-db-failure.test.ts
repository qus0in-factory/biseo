import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest } from './refresh-fixture.js'

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
