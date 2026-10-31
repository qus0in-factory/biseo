import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { refreshFixture, refreshRequest } from './refresh-fixture.js'

for (const field of ['idle','expires','revoked']) {
 test(`${field} denies refresh without issuing cookies`, async () => {
  const { env, db, token } = await refreshFixture()
  await db.prepare(`UPDATE refresh_sessions SET ${field}=1`).run()
  const r = await app.fetch(refreshRequest(token),env)
  assert.equal(r.status,401)
  assert.equal(r.headers.get('set-cookie'),null)
 })
}
