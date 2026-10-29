import { interruptPane } from '../app/interrupt-pane.js'
import { createHerdrUpstream } from '../infra/herdr-upstream.js'
import { type App, checkCsrf, jsonNoStore, requireOwner } from './timeline-guards.js'

export function registerInterruptRoute(app: App) {
  app.post('/api/panes/:paneId/interrupt', async (c) => {
    const csrf = checkCsrf(c)
    if (csrf) return csrf
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const body = await c.req.json().catch(() => null)
    const r = await interruptPane(
      createHerdrUpstream(c.env, c),
      c.env.ALLOWED_WORKSPACE_ID,
      c.req.param('paneId'),
      body,
    )
    return jsonNoStore(c, r.body, r.status)
  })
}
