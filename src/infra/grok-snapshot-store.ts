import type { ProviderUsage } from '../domain/usage-types.js'

let lastGrokSnapshot: ProviderUsage | null = null

export const getLastGrokSnapshot = () => lastGrokSnapshot
export const setLastGrokSnapshot = (s: ProviderUsage | null) => { lastGrokSnapshot = s }

export function makeStaleGrokUsage(last: ProviderUsage | null): ProviderUsage {
  if (!last) return { provider: 'grok', state: 'unknown', windows: [] }
  return {
    ...last,
    windows: last.windows.map(w => ({
      ...w,
      source: 'grok-stale'
    }))
  }
}
