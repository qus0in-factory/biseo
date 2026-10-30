import { cancelTimelineMessage } from '../app/cancel-turn.js'
import { applyResult } from '../app/timeline-apply.js'
import { createHerdrUpstream } from '../infra/herdr-upstream.js'
import { type App, checkCsrf, jsonNoStore, requireOwner } from './timeline-guards.js'
import { requireDb } from './storage-guard.js'

export function registerDeleteTurn(app: App) {
  app.delete('/api/turns/:requestId', async (c) => {
    const csrf = checkCsrf(c)
    if (csrf) return csrf
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const d = requireDb(c)
    if (!d.ok) return d.res
    const id = c.req.param('requestId')
    const r = await cancelTimelineMessage(
      createHerdrUpstream(c.env, c),
      c.env.ALLOWED_WORKSPACE_ID,
      id,
    )
    if (r.status === 200 && r.body.status === 'cancelled') await applyResult(d.db, id, r.body)
    return jsonNoStore(c, r.body, r.status)
  })
}
