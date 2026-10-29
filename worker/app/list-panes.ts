import { verifyAllowedWorkspace } from '../domain/workspace-guard.js'
import type { HerdrUpstreamPort } from './timeline-ports.js'

export async function getWorkspacePanes(
  upstream: HerdrUpstreamPort,
  allowedWs: string | undefined,
  requestedWs: string,
) {
  const ws = verifyAllowedWorkspace(allowedWs, requestedWs)
  if (!ws.ok) {
    return {
      status: ws.status,
      body: ws.reason ? { error: ws.error, reason: ws.reason } : { error: ws.error },
    }
  }
  const res = await upstream.listPanes(ws.workspaceId)
  return { status: res.status, body: res.ok ? res.data : res.body }
}
