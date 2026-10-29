import { isSafeId } from '../domain/message-input.js'
import { verifyAllowedWorkspace } from '../domain/workspace-guard.js'
import type { HerdrUpstreamPort } from './timeline-ports.js'

export async function cancelTimelineMessage(
  upstream: HerdrUpstreamPort,
  allowedWs: string | undefined,
  requestId: string,
) {
  const ws = verifyAllowedWorkspace(allowedWs)
  if (!ws.ok) return { status: ws.status, body: { error: ws.error } }
  if (!isSafeId(requestId)) return { status: 400 as const, body: { error: 'bad_request' } }
  const res = await upstream.cancelTurn(requestId)
  return { status: res.status, body: res.ok ? res.data : res.body }
}
