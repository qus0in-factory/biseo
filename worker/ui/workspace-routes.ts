import { getWorkspacePanes } from '../app/list-panes.js'
import { verifyAllowedWorkspace } from '../domain/workspace-guard.js'
import { createHerdrUpstream } from '../infra/herdr-upstream.js'
import { type App, jsonNoStore, requireOwner } from './timeline-guards.js'

export function registerWorkspaceRoutes(app: App) {
  app.get('/api/config', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const w = verifyAllowedWorkspace(c.env.ALLOWED_WORKSPACE_ID)
    if (!w.ok) return jsonNoStore(c, { error: w.error }, w.status)
    return jsonNoStore(c, { workspaceId: w.workspaceId }, 200)
  })
  app.get('/api/workspaces/:wsId/panes', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const up = createHerdrUpstream(c.env)
    const r = await getWorkspacePanes(up, c.env.ALLOWED_WORKSPACE_ID, c.req.param('wsId'))
    return jsonNoStore(c, r.body, r.status)
  })
}
