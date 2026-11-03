import type { PaneStatus, BlockedReason } from './timeline'
export type DisplayStatus = PaneStatus | 'input_required'
export function inputStatus(status: PaneStatus, reason?: BlockedReason): DisplayStatus {
  return status === 'blocked' && reason === 'input_request' ? 'input_required' : status
}
