import type { UsageProvider } from './usage'
import { usageLimitStates } from './usage-limit-state'

export function usageLimitCount(provider: UsageProvider): { available: number; limited: number } | null {
  const states = usageLimitStates(provider)
  if (states.length < 2) return null
  const limited = states.filter((x) => x.limited).length
  return { available: states.filter((x) => x.known).length - limited, limited }
}
