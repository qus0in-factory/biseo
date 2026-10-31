import { createHerdrUpstream } from '../infra/herdr-upstream.js'
import { type App, jsonNoStore, requireOwner } from './timeline-guards.js'
export function registerWorkspacesListRoutes(app: App) {
  app.get('/api/workspaces', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const up = createHerdrUpstream(c.env, c)
    const r = await up.listWorkspaces()
    if (!r.ok) return jsonNoStore(c, r.body, r.status)
    return jsonNoStore(c, { workspaces: r.data.workspaces }, 200)
  })
}