import type { UsageProvider } from './usage'
import { usageLimitStates } from './usage-limit-state'
import { needsUsageNotice } from './usage-failure-state'
import r from '../resources.json'

export const compactUsageNote = (p: UsageProvider) =>
  !needsUsageNotice(p) && usageLimitStates(p).some(s => s.known)

export const usageReasonText = (reason?: string | null) => !reason ? null
  : reason === 'rate_limited' ? r.usageReasonRateLimited
  : (r as Record<string, string>)[reason] ?? r.usageReasonUnknown
