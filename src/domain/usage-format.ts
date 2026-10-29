import type { Availability } from './timeline.js'
import type { ProviderUsage } from './usage-types.js'

export function toProviderUsage(provider: string, a: Availability): ProviderUsage {
  return {
    provider,
    state: a.state,
    resetsAt: a.resetsAt,
    checkedAt: a.checkedAt,
    limitReached: a.state === 'limited',
    window: a.window,
    usedPercent: a.usedPercent ?? null,
  }
}
