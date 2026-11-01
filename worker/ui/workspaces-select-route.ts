import { callUpstreamJson } from '../infra/herdr-upstream-http.js'
import { type App, jsonNoStore, requireOwner } from './timeline-guards.js'
export function registerWorkspacesSelectRoute(app: App) {
  app.post('/api/workspaces/select', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    let body: any = null
    try { body = await c.req.json() } catch { body = null }
    const id = body?.workspaceId
    const r = await callUpstreamJson<{workspaceId:string}>(c.env, '/herdr/workspaces/select', 'POST', { workspaceId: id }, crypto.randomUUID())
    if (!r.ok) return jsonNoStore(c, r.body, r.status)
    return jsonNoStore(c, { workspaceId: r.data?.workspaceId ?? id, ok: true }, 200)
  })
}