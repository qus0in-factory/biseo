import { verifyAllowedWorkspace } from '../domain/workspace-guard.js'
import { type App, jsonNoStore, requireOwner } from './timeline-guards.js'
import { registerWorkspacesListRoutes } from './workspaces-list-routes.js'
import { registerWorkspacesPanesRoute } from './workspaces-panes-route.js'
import { registerWorkspacesSelectRoute } from './workspaces-select-route.js'
export function registerWorkspaceRoutes(app: App) {
  app.get('/api/config', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const w = verifyAllowedWorkspace(c.env.ALLOWED_WORKSPACE_ID)
    if (!w.ok) return jsonNoStore(c, { error: w.error }, w.status)
    return jsonNoStore(c, { workspaceId: w.workspaceId }, 200)
  })
  registerWorkspacesListRoutes(app)
  registerWorkspacesSelectRoute(app)
  registerWorkspacesPanesRoute(app)
}