import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('POST /api/workspaces/select proxies successful selection', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ workspaceId: 'w1V', ok: true })) as any
  try {
    const r = await app.fetch(new Request('http://localhost/api/workspaces/select', { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ workspaceId: 'w1V' }) }), env)
    assert.equal(r.status, 200)
    assert.deepEqual(await r.json(), { workspaceId: 'w1V', ok: true })
  } finally { globalThis.fetch = orig }
})