import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('GET /api/config requires auth and fails closed when ALLOWED_WORKSPACE_ID is missing', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const unauth = await app.fetch(new Request('http://localhost/api/config'), env)
  assert.equal(unauth.status, 401)
  assert.equal(unauth.headers.get('cache-control'), 'no-store')

  const missingWs = await app.fetch(
    new Request('http://localhost/api/config', { headers: { Cookie: cookie } }),
    { ...env, ALLOWED_WORKSPACE_ID: '' },
  )
  assert.equal(missingWs.status, 500)
  assert.deepEqual(await missingWs.json(), { error: 'misconfigured' })

  const ok = await app.fetch(
    new Request('http://localhost/api/config', { headers: { Cookie: cookie } }),
    env,
  )
  assert.equal(ok.status, 200)
  assert.deepEqual(await ok.json(), { workspaceId: 'w1T' })
})
