import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('server source does not block the public login route', async () => {
  const { env } = await createTimelineTestEnv()
  const r = await app.fetch(
    new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }),
    { ...env, WORKSPACE_CONFIG_SOURCE: 'server' },
  )
  assert.notEqual(r.status, 401)
  assert.notDeepEqual(await r.json(), { error: 'unauthorized' })
})
