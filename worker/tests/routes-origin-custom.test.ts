import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('CSRF allows custom domain', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const e = { ...env, ALLOWED_ORIGINS: 'https://biseo.qus0in.workers.dev,https://biseo.qus0in.dev' }
  const b = JSON.stringify({ requestId: 'r1', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' })
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ requestId: 'r1', status: 'queued' }, { status: 202 })) as any
  try {
    const res = await app.fetch(new Request('https://biseo.qus0in.dev/api/timeline/messages', { method: 'POST', headers: { Cookie: cookie, Origin: 'https://biseo.qus0in.dev' }, body: b }), e)
    assert.equal(res.status, 202)
  } finally {
    globalThis.fetch = orig
  }
})
