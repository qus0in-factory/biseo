import { interruptAudit } from './interrupt-audit.js'
import type { InterruptDeps, InterruptFail } from './interrupt-types.js'
import type { PaneInfo } from '../domain/herdr.js'

export async function interruptLookup(
  d: InterruptDeps,
  paneId: string,
  key: string,
): Promise<{ pane: PaneInfo } | InterruptFail> {
  let pane: PaneInfo | undefined
  try {
    pane = await d.herdr.getPane(paneId)
  } catch {
    interruptAudit(d.audit, paneId, key, 'failed')
    return { status: 502, body: { error: 'herdr_unavailable' } }
  }
  if (!pane) {
    interruptAudit(d.audit, paneId, key, 'not_found')
    return { status: 404, body: { error: 'not_found' } }
  }
  if (d.allowedWorkspaceId && pane.workspace_id !== d.allowedWorkspaceId) {
    interruptAudit(d.audit, paneId, key, 'forbidden')
    return { status: 403, body: { error: 'workspace_not_allowed' } }
  }
  return { pane }
}
