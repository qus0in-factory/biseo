import type { PaneSummary } from '../domain/timeline'
export const metaPane = (modelId: string | null, modelProvider = ''): PaneSummary => ({
  paneId: 'p1',
  name: 'ds-o',
  agentKind: 'opencode',
  agentName: 'ds-o',
  modelId,
  modelProvider,
  status: 'idle',
  sendable: true,
  disabledReason: null,
})
