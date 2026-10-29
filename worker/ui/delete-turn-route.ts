import { cancelTimelineMessage } from '../app/cancel-turn.js'
import { createHerdrUpstream } from '../infra/herdr-upstream.js'
import { type App, checkCsrf, jsonNoStore, requireOwner } from './timeline-guards.js'

export function registerDeleteTurn(app: App) {
  app.delete('/api/turns/:requestId', async (c) => {
    const csrf = checkCsrf(c)
    if (csrf) return csrf
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const r = await cancelTimelineMessage(
      createHerdrUpstream(c.env, c),
      c.env.ALLOWED_WORKSPACE_ID,
      c.req.param('requestId'),
    )
    return jsonNoStore(c, r.body, r.status)
  })
}
