import type {Context} from 'hono'
import type {TurnDeps} from '../app/turn-deps.js'
import {writeSelectedWorkspace} from '../infra/workspace-selection.js'

export function workspacesRoute(d: TurnDeps) {
 return async (c: Context) => {
  const list = await d.herdr.listWorkspaces?.() ?? []
  const workspaces = list.map(w => ({
   workspaceId: w.workspace_id ?? w.id,
   id: w.workspace_id ?? w.id,
   label: w.label ?? null,
   focused: !!w.focused,
   paneCount: w.pane_count,
   number: w.number,
  }))
  return c.json({workspaces}, 200, {'Cache-Control':'no-store'})
 }
}

export function selectWorkspaceRoute(d: TurnDeps) {
 return async (c: Context) => {
  const body = await c.req.json().catch(() => null) as Record<string, unknown> | null
  const id = body?.workspaceId
  if (typeof id !== 'string' || !/^[A-Za-z0-9:_-]+$/.test(id)) {
   return c.json({error: 'workspace_not_allowed'}, 403, {'Cache-Control':'no-store'})
  }
  const list = await d.herdr.listWorkspaces?.() ?? []
  const ids = list.map(w => String(w.workspace_id ?? w.id ?? ''))
  if (!ids.includes(id)) {
   return c.json({error: 'workspace_not_allowed'}, 403, {'Cache-Control':'no-store'})
  }
  writeSelectedWorkspace(id)
  return c.json({workspaceId: id, ok: true}, 200, {'Cache-Control':'no-store'})
 }
}
