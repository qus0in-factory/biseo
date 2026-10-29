import type { Availability, BlockedReason, PaneSummary } from '../domain/timeline.js'

export function paneBlocked(
  summary: Pick<PaneSummary, 'status'>,
  availability: Availability,
  suspected: boolean,
): BlockedReason {
  if (availability.state === 'limited') return 'usage_limited'
  if (summary.status !== 'blocked') return null
  return suspected ? 'suspected_limit' : 'awaiting_input'
}
