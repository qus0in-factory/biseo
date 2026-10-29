import { isSafeId } from '../domain/message-input.js'
import { verifyAllowedWorkspace } from '../domain/workspace-guard.js'
import type { HerdrUpstreamPort } from './timeline-ports.js'

export async function getTimelineMessage(
  upstream: HerdrUpstreamPort,
  allowedWs: string | undefined,
  requestId: string,
) {
  const ws = verifyAllowedWorkspace(allowedWs)
  if (!ws.ok) return { status: ws.status, body: { error: ws.error } }
  if (!isSafeId(requestId)) return { status: 400 as const, body: { error: 'bad_request' } }
  const res = await upstream.getTurn(requestId)
  if (!res.ok) return { status: res.status, body: res.body }
  if (res.data.workspaceId && res.data.workspaceId !== ws.workspaceId) {
    return { status: 404 as const, body: { error: 'not_found' } }
  }
  return { status: res.status, body: res.data }
}
