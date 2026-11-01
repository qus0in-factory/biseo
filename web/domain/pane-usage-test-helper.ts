import type { PaneSummary } from './timeline'

export const makeTestPane = (
  kind: string | null = 'claude',
  name: string = 'worker',
): PaneSummary => ({
  paneId: 'p1',
  tabId: 't1',
  name,
  agentKind: kind,
  agentName: name,
  status: 'idle',
  sendable: true,
  disabledReason: null,
})
