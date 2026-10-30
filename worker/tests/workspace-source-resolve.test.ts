import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('server source resolves the workspace from /herdr/config', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ workspaceId: 'w1V' })) as any
  try {
    const r = await app.fetch(new Request('http://localhost/api/config', { headers: { Cookie: cookie } }), { ...env, WORKSPACE_CONFIG_SOURCE: 'server' })
    assert.equal(r.status, 200)
    assert.deepEqual(await r.json(), { workspaceId: 'w1V' })
  } finally { globalThis.fetch = orig }
})
