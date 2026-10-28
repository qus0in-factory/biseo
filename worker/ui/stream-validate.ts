import { verifyAllowedWorkspace } from '../domain/workspace-guard.js'
import { type Ctx, jsonNoStore, requireOwner } from './timeline-guards.js'

export async function validateStreamRequest(c: Ctx) {
  const a = await requireOwner(c)
  if (!a.ok) return { ok: false as const, res: a.res }
  const w = verifyAllowedWorkspace(c.env.ALLOWED_WORKSPACE_ID, c.req.query('workspaceId'))
  if (!w.ok) {
    const b = w.reason ? { error: w.error, reason: w.reason } : { error: w.error }
    return { ok: false as const, res: jsonNoStore(c, b, w.status) }
  }
  const expMs = Date.parse(a.claims.exp)
  if (!Number.isFinite(expMs) || expMs <= Date.now()) {
    return { ok: false as const, res: jsonNoStore(c, { error: 'unauthorized' }, 401) }
  }
  const lastId = c.req.header('last-event-id') || c.req.query('lastEventId')
  return { ok: true as const, workspaceId: w.workspaceId, expMs, lastId }
}
