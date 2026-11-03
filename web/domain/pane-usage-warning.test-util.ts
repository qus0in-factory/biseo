import type { UsageProvider, UsageWindow } from './usage'

export const warningWindow = (
  window: string, usedPercent: number | null, source: string | null = null,
): UsageWindow => ({
  window, usedPercent, resetsAt: null, checkedAt: null, limitReached: false, source,
})

export const warningProvider = (
  windows: UsageWindow[], state: UsageProvider['state'] = 'available',
): UsageProvider[] => [{ provider: 'codex', state, windows }]
