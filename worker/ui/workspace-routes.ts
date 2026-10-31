import { getWorkspacePanes } from '../app/list-panes.js'
import { verifyAllowedWorkspace } from '../domain/workspace-guard.js'
import { createHerdrUpstream } from '../infra/herdr-upstream.js'
import { callUpstreamJson } from '../infra/herdr-upstream-http.js'
import { type App, jsonNoStore, requireOwner } from './timeline-guards.js'

export function registerWorkspaceRoutes(app: App) {
  app.get('/api/config', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const w = verifyAllowedWorkspace(c.env.ALLOWED_WORKSPACE_ID)
    if (!w.ok) return jsonNoStore(c, { error: w.error }, w.status)
    return jsonNoStore(c, { workspaceId: w.workspaceId }, 200)
  })

  app.get('/api/workspaces', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const up = createHerdrUpstream(c.env, c)
    const r = await up.listWorkspaces()
    if (!r.ok) return jsonNoStore(c, r.body, r.status)
    return jsonNoStore(c, { workspaces: r.data.workspaces }, 200)
  })

  app.get('/api/workspaces/:wsId/panes', async (c) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const up = createHerdrUpstream(c.env, c)
    const r = await getWorkspacePanes(up, c.env.ALLOWED_WORKSPACE_ID, c.req.param('wsId'))
    return jsonNoStore(c, r.body, r.status)
  })

  const select = async (c: any) => {
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    let body: any = null
    try { body = await c.req.json() } catch { body = null }
    const id = body?.workspaceId ?? body?.workspace_id ?? body?.id ?? body?.workspace ?? body?.selectedWorkspaceId
    const r = await callUpstreamJson<{workspaceId:string}>(c.env, '/herdr/workspaces/select', 'POST', { workspaceId: id }, crypto.randomUUID())
    if (!r.ok) return jsonNoStore(c, r.body, r.status)
    return jsonNoStore(c, { workspaceId: r.data?.workspaceId ?? id, ok: true }, 200)
  }
  app.post('/api/workspaces/select', select)
  app.post('/api/workspaces', select)
  app.put('/api/workspaces', select)
  app.post('/api/config', select)
  app.put('/api/config', select)
  app.post('/api/workspace', select)
}