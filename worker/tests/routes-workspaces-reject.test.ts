import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('POST /api/workspaces/select proxies rejection for unknown id', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ error: 'workspace_not_allowed' }, { status: 403 })) as any
  try {
    const r = await app.fetch(new Request('http://localhost/api/workspaces/select', { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ workspaceId: 'unknown' }) }), env)
    assert.equal(r.status, 403)
    assert.deepEqual(await r.json(), { error: 'workspace_not_allowed' })
  } finally { globalThis.fetch = orig }
})