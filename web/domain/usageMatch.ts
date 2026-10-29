import type { UsageProvider } from './usage'

export function usageForPane(providers: UsageProvider[], agentKind?: string | null): UsageProvider[] {
  const key = agentKind?.trim().toLowerCase()
  const hit = key ? providers.find((p) => p.provider.toLowerCase() === key) : undefined
  if (hit) return [hit]
  return [{ provider: agentKind?.trim() || 'unknown', state: 'unknown', windows: [] }]
}
