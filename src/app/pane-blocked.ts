import type { Availability, BlockedReason, PaneSummary } from '../domain/timeline.js'

export function paneBlocked(
  summary: Pick<PaneSummary, 'status'>,
  availability: Availability,
  limitSuspected: boolean,
  inputSuspected = false,
): BlockedReason {
  if (availability.state === 'limited') return 'usage_limit'
  if (summary.status !== 'blocked') return null
  if (limitSuspected) return 'usage_limit'
  if (inputSuspected) return 'input_request'
  return 'unknown'
}
