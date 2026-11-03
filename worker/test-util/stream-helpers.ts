import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'

export async function streamOnce(lastEventId: string) {
  const { env, cookie } = await createTimelineTestEnv()
  const orig = globalThis.fetch
  let id = ''
  globalThis.fetch = (async (_u: any, init?: RequestInit) => {
    id = new Headers(init?.headers).get('last-event-id') ?? ''
    return new Response('id: 2\nevent: turn.updated\ndata: {}\n\nevent: heartbeat\ndata: {}\n\n')
  }) as any
  try {
    const req = new Request('http://localhost/api/timeline/stream?workspaceId=w1T', {
      headers: { Cookie: cookie, 'Last-Event-ID': lastEventId },
    })
    const res = await app.fetch(req, env)
    return { res, id, text: await res.text() }
  } finally {
    globalThis.fetch = orig
  }
}
