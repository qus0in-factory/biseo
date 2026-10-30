import type { ProviderUsage } from './usage-types.js'

export function unknownUsage(provider: string): ProviderUsage {
  return {
    provider,
    state: 'unknown',
    windows: []
  }
}
