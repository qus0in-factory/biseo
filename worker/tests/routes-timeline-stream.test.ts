import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

test('GET /api/timeline/stream forwards Last-Event-ID and relays SSE', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  let id = ''
  globalThis.fetch = (async (_u: any, init?: RequestInit) => {
    id = new Headers(init?.headers).get('last-event-id') ?? ''
    return new Response('id: 2\nevent: turn.updated\ndata: {}\n\n')
  }) as any
  try {
    const req = new Request('http://localhost/api/timeline/stream?workspaceId=w1T', {
      headers: { Cookie: cookie, 'Last-Event-ID': '1' },
    })
    const res = await app.fetch(req, env)
    assert.equal(res.status, 200)
    assert.equal(id, '1')
    assert.match(await res.text(), /event: turn\.updated/)
  } finally {
    globalThis.fetch = orig
  }
})
