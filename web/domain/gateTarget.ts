import type { PaneSummary } from './timeline'

export function gateTarget(
  target: PaneSummary | undefined,
  online: boolean,
): PaneSummary | undefined {
  if (!target) return undefined
  if (online) return target
  return {
    ...target,
    sendable: false,
    disabledReason: 'connection_unavailable',
  }
}
