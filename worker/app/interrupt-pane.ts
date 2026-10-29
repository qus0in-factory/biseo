import { parseInterruptKey } from '../domain/interrupt-input.js'
import { paneInWorkspace } from '../domain/pane-guard.js'
import { verifyAllowedWorkspace } from '../domain/workspace-guard.js'
import type { HerdrUpstreamPort } from './timeline-ports.js'

export async function interruptPane(
  upstream: HerdrUpstreamPort,
  allowed: string | undefined,
  paneId: string,
  body: unknown,
) {
  const ws = verifyAllowedWorkspace(allowed)
  if (!ws.ok) {
    return {
      status: ws.status,
      body: ws.reason ? { error: ws.error, reason: ws.reason } : { error: ws.error },
    }
  }
  if (!paneInWorkspace(ws.workspaceId, paneId)) {
    return { status: 403 as const, body: { error: 'forbidden', reason: 'workspace_not_allowed' } }
  }
  const key = parseInterruptKey(body)
  if (!key) return { status: 400 as const, body: { error: 'bad_request' } }
  const res = await upstream.interruptPane(paneId, key)
  return { status: res.status, body: res.ok ? res.data : res.body }
}
