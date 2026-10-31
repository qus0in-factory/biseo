import { getWorkspacePanes } from '../app/list-panes.js'
import { verifyAllowedWorkspace } from '../domain/workspace-guard.js'
import { createHerdrUpstream } from '../infra/herdr-upstream.js'
import { type App, jsonNoStore, requireOwner } from './timeline-guards.js'
export function registerWorkspacesPanesRoute(app: App) {
  app.get('/api/workspaces/:wsId/panes', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const up = createHerdrUpstream(c.env, c)
    const r = await getWorkspacePanes(up, c.env.ALLOWED_WORKSPACE_ID, c.req.param('wsId'))
    return jsonNoStore(c, r.body, r.status)
  })
}