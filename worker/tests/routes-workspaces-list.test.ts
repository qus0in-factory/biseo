import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('GET /api/workspaces lists detected workspaces', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ workspaces: [{ workspaceId: 'w1T', id: 'w1T', label: 'main', focused: true, paneCount: 1 }] })) as any
  try {
    const r = await app.fetch(new Request('http://localhost/api/workspaces', { headers: { Cookie: cookie } }), env)
    assert.equal(r.status, 200)
    assert.deepEqual(await r.json(), { workspaces: [{ workspaceId: 'w1T', id: 'w1T', label: 'main', focused: true, paneCount: 1 }] })
  } finally { globalThis.fetch = orig }
})