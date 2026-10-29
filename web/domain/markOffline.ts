import type { PaneSummary } from './timeline'

export function markOffline(panes: PaneSummary[]): PaneSummary[] {
  return panes.map((p) => ({
    ...p,
    sendable: false,
    disabledReason: 'connection_unavailable',
  }))
}
