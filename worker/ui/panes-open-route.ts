import { callUpstreamJson } from '../infra/herdr-upstream-http.js'
import { type App, jsonNoStore, requireOwner } from './timeline-guards.js'
export function registerPaneOpenRoute(app: App) {
  app.post('/api/panes', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    let body: Record<string, unknown> | null = null
    try { body = await c.req.json() as Record<string, unknown> } catch { body = null }
    const id = crypto.randomUUID()
    const r = await callUpstreamJson(c.env, '/herdr/panes', 'POST', body ?? {}, id)
    if (!r.ok) return jsonNoStore(c, r.body, r.status)
    return jsonNoStore(c, r.data, 200)
  })
}
