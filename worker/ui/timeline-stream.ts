import { createHerdrUpstream } from '../infra/herdr-upstream.js'
import { createBoundedStream } from './sse-bounded-stream.js'
import { validateStreamRequest } from './stream-validate.js'
import { type App, jsonNoStore } from './timeline-guards.js'

const SSE = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-store',
  Connection: 'keep-alive',
}

export function registerStreamRoute(app: App) {
  app.get('/api/timeline/stream', async (c) => {
    const v = await validateStreamRequest(c)
    if (!v.ok) return v.res
    const ac = new AbortController()
    c.req.raw.signal.addEventListener('abort', () => ac.abort(), { once: true })
    const up = await createHerdrUpstream(c.env).openEventStream(v.workspaceId, v.lastId, ac.signal)
    if (!(up instanceof Response) || !up.body) {
      return jsonNoStore(c, { error: up instanceof Response ? 'bad_gateway' : up.error }, 502)
    }
    return new Response(createBoundedStream(up.body, v.expMs, ac), { status: 200, headers: SSE })
  })
}
