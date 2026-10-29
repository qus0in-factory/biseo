import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('CSRF allows both configured domains', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const e = { ...env, ALLOWED_ORIGINS: 'https://biseo.qus0in.workers.dev,https://biseo.qus0in.dev' }
  const body = JSON.stringify({ requestId: 'r1', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' })
  for (const host of ['biseo.qus0in.workers.dev', 'biseo.qus0in.dev']) {
    const orig = globalThis.fetch
    globalThis.fetch = (async () => Response.json({ requestId: 'r1', status: 'queued' }, { status: 202 })) as any
    try {
      const res = await app.fetch(
        new Request(`https://${host}/api/timeline/messages`, {
          method: 'POST',
          headers: { Cookie: cookie, Origin: `https://${host}` },
          body,
        }),
        e,
      )
      assert.notEqual(res.status, 403, host)
    } finally {
      globalThis.fetch = orig
    }
  }
})

test('CSRF denies unlisted domain', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const e = { ...env, ALLOWED_ORIGINS: 'https://biseo.qus0in.workers.dev,https://biseo.qus0in.dev' }
  const body = JSON.stringify({ requestId: 'r2', workspaceId: 'w1T', paneId: 'w1T:p1', text: 'hi' })
  const res = await app.fetch(
    new Request('https://biseo.qus0in.dev/api/timeline/messages', {
      method: 'POST',
      headers: { Cookie: cookie, Origin: 'https://evil.test' },
      body,
    }),
    e,
  )
  assert.equal(res.status, 403)
})
