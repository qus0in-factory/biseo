import type { BlockedReason } from './timeline'
import { availabilityWhen } from './availability'
import r from '../resources.json'

const res = r as Record<string, string>

export function getBlockedReasonText(
  reason: BlockedReason | undefined,
  resetsAt?: string | null,
  suspected?: boolean | { usageLimitSuspected?: boolean },
): string | null {
  if (!reason) return null
  if (reason === 'usage_limit') {
    const at = availabilityWhen(resetsAt ?? null, res.availabilityNoReset)
    const isSuspected =
      typeof suspected === 'boolean'
        ? suspected
        : !!suspected?.usageLimitSuspected
    const tpl =
      isSuspected && res.blocked_usage_limit_suspected
        ? res.blocked_usage_limit_suspected
        : res.blocked_usage_limit
    return (tpl ?? '').replace('{at}', at)
  }
  if (reason === 'input_request') return res.blocked_input_request
  if (reason === 'unknown') return res.blocked_unknown
  return null
}
