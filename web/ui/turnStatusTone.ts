import type { PaneStatus, TurnStatus } from '../domain/timeline'

const tones: Record<TurnStatus, PaneStatus> = {
  queued: 'idle',
  working: 'working',
  completed: 'done',
  capture_unavailable: 'unknown',
  blocked: 'blocked',
  failed: 'blocked',
  timeout: 'blocked',
  cancelled: 'idle',
}

export function turnStatusTone(status: TurnStatus): PaneStatus {
  return tones[status] ?? 'unknown'
}
