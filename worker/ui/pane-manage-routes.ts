import { callUpstreamJson } from '../infra/herdr-upstream-http.js'
import { type App, jsonNoStore, requireOwner } from './timeline-guards.js'
export function registerPaneManageRoutes(app: App) {
  app.post('/api/panes', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    let body: any = null
    try { body = await c.req.json() } catch { body = null }
    const id = crypto.randomUUID()
    const r = await callUpstreamJson(c.env, '/herdr/panes', 'POST', body ?? {}, id)
    if (!r.ok) return jsonNoStore(c, r.body, r.status)
    return jsonNoStore(c, r.data, 200)
  })
  app.delete('/api/panes/:paneId', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const id = crypto.randomUUID()
    const r = await callUpstreamJson(c.env, `/herdr/panes/${encodeURIComponent(c.req.param('paneId'))}`, 'DELETE', undefined, id)
    if (!r.ok) return jsonNoStore(c, r.body, r.status)
    return jsonNoStore(c, r.data, 200)
  })
  app.post('/api/panes/:paneId/rename', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    let body: any = null
    try { body = await c.req.json() } catch { body = null }
    const id = crypto.randomUUID()
    const r = await callUpstreamJson(c.env, `/herdr/panes/${encodeURIComponent(c.req.param('paneId'))}/rename`, 'POST', body ?? {}, id)
    if (!r.ok) return jsonNoStore(c, r.body, r.status)
    return jsonNoStore(c, r.data, 200)
  })
}
