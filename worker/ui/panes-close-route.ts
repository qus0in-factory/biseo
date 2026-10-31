import { callUpstreamJson } from '../infra/herdr-upstream-http.js'
import { type App, jsonNoStore, requireOwner } from './timeline-guards.js'
export function registerPaneCloseRoute(app: App) {
  app.delete('/api/panes/:paneId', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const paneId = c.req.param('paneId')
    const db = c.env.BISEO_DB
    if (db) {
      const row = await db.prepare(`SELECT 1 FROM timeline_turns WHERE pane_id=? AND owner_subject=? AND status IN ('queued','working','blocked','timeout') AND NOT (status='timeout' AND IFNULL(error_code,'')='late_capture_expired') LIMIT 1`).bind(paneId, a.claims.sub).first()
      if (row) return jsonNoStore(c, { error: 'pending_reservations' }, 409)
    }
    const id = crypto.randomUUID()
    const r = await callUpstreamJson(c.env, `/herdr/panes/${encodeURIComponent(paneId)}`, 'DELETE', undefined, id)
    if (!r.ok) return jsonNoStore(c, r.body, r.status)
    return jsonNoStore(c, r.data, 200)
  })
}
