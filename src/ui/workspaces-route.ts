import type {Context} from 'hono'
import type {TurnDeps} from '../app/turn-deps.js'
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