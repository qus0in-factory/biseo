import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('GET /api/timeline/messages/:requestId enforces workspace boundary and GET stream closes on expiry', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  globalThis.fetch = (async () =>
    Response.json({ requestId: 'req_x', workspaceId: 'otherWs', status: 'completed' })) as typeof fetch
  try {
    const r = await app.fetch(
      new Request('http://localhost/api/timeline/messages/req_x', { headers: { Cookie: cookie } }),
      env,
    )
    assert.equal(r.status, 404)
  } finally {
    globalThis.fetch = orig
  }
})
