import type { BlockedReason } from './timeline'
import { availabilityWhen } from './availability'
import r from '../resources.json'

const res = r as Record<string, string>

export function getBlockedReasonText(
  reason: BlockedReason | undefined,
  resetsAt?: string | null,
): string | null {
  if (!reason) return null
  if (reason === 'usage_limited') {
    const at = availabilityWhen(resetsAt ?? null, res.availabilityNoReset)
    return res.blocked_usage_limited.replace('{at}', at)
  }
  if (reason === 'awaiting_input') return res.blocked_awaiting_input
  if (reason === 'suspected_limit') return res.blocked_suspected_limit
  return null
}
