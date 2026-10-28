import type { PaneSummary, TimelineItem } from '../domain/timeline'

export function makeOptimistic(
  wsId: string,
  target: PaneSummary,
  text: string,
): { requestId: string; item: TimelineItem } {
  const requestId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `req_${Date.now()}`
  const item: TimelineItem = {
    requestId,
    workspaceId: wsId,
    paneId: target.paneId,
    targetName: target.name,
    agentKind: target.agentKind,
    promptText: text,
    status: 'queued',
    createdAt: new Date().toISOString(),
  }
  return { requestId, item }
}
