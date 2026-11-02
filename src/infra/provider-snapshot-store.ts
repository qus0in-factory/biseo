import type { ProviderUsage } from '../domain/usage-types.js'

const store = new Map<string, ProviderUsage>()

export function setProviderSnapshot(provider: string, usage: ProviderUsage | null): void {
  if (usage) store.set(provider, usage)
  else store.delete(provider)
}

export function getProviderSnapshot(provider: string): ProviderUsage | null {
  return store.get(provider) ?? null
}

export function clearProviderSnapshots(): void {
  store.clear()
}

export function makeStaleUsage(provider: string, last: ProviderUsage | null, reason = 'auth_required'): ProviderUsage {
  if (!last) return { provider, state: 'unknown', metrics: [], windows: [], reason }
  return {
    ...last,
    reason,
    metrics: (last.metrics ?? []).map((m) => ({ ...m })),
    windows: (last.windows ?? []).map((w) => ({ ...w, source: `${provider}-stale` })),
  }
}
