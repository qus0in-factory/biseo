import { parseSubmitMessageInput } from '../domain/message-input.js'
import { verifyAllowedWorkspace } from '../domain/workspace-guard.js'
import type { HerdrUpstreamPort } from './timeline-ports.js'

export async function submitTimelineMessage(
  upstream: HerdrUpstreamPort,
  allowedWs: string | undefined,
  rawBody: unknown,
) {
  const input = parseSubmitMessageInput(rawBody)
  if (!input) return { status: 400 as const, body: { error: 'bad_request' } }
  const ws = verifyAllowedWorkspace(allowedWs, input.workspaceId)
  if (!ws.ok) {
    return {
      status: ws.status,
      body: ws.reason ? { error: ws.error, reason: ws.reason } : { error: ws.error },
    }
  }
  const res = await upstream.submitTurn(input)
  return { status: res.status, body: res.ok ? res.data : res.body }
}
