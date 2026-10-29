import { submitTimelineMessage } from '../app/submit-message.js'
import { getTimelineMessage } from '../app/timeline-query.js'
import { createHerdrUpstream } from '../infra/herdr-upstream.js'
import { type App, checkCsrf, jsonNoStore, requireOwner } from './timeline-guards.js'

export function registerTimelineMessages(app: App) {
  app.post('/api/timeline/messages', async (c) => {
    const csrf = checkCsrf(c)
    if (csrf) return csrf
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const b = await c.req.json().catch(() => null)
    const r = await submitTimelineMessage(createHerdrUpstream(c.env, c), c.env.ALLOWED_WORKSPACE_ID, b)
    return jsonNoStore(c, r.body, r.status)
  })
  app.get('/api/timeline/messages/:requestId', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const r = await getTimelineMessage(createHerdrUpstream(c.env, c), c.env.ALLOWED_WORKSPACE_ID, c.req.param('requestId'))
    return jsonNoStore(c, r.body, r.status)
  })
}
