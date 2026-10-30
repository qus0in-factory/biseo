import type { ProviderUsage } from './usage-types.js'

export function unknownUsage(provider: string, reason?: string, retryAt?: string): ProviderUsage {
  return {
    provider,
    state: 'unknown',
    metrics: [],
    windows: [],
    reason: reason ?? null,
    retryAt: retryAt ?? null
  }
}
