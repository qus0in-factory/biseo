import type { TurnStatus } from './timeline'
export function canTransition(f: TurnStatus, t: TurnStatus, e?: string | null): boolean {
  if (f === t) return true
  if (f === 'queued') return t !== 'queued'
  if (f === 'working') return t !== 'queued' && t !== 'cancelled'
  if (f === 'timeout') return t === 'completed' || t === 'blocked' || t === 'failed' || t === 'capture_unavailable'
  if (f === 'failed' && e === 'delivery_uncertain') return t === 'working' || t === 'completed'
  return false
}
