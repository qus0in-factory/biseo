import type { ProviderUsage } from '../../domain/usage-types.js'

export const chk = '2026-10-30T10:00:00.000Z'

export const good: ProviderUsage = {
  provider: 'claude',
  state: 'available',
  metrics: [
    {
      id: 'five_hour',
      label: '5h',
      unit: 'percent',
      used: 12,
      limit: 100,
      remaining: 88,
      resetsAt: '2026-10-30T11:00:00.000Z',
    },
  ],
  windows: [
    {
      window: 'primary',
      usedPercent: 12,
      resetsAt: '2026-10-30T11:00:00.000Z',
      checkedAt: chk,
      limitReached: false,
      source: 'claude',
    },
  ],
  source: 'claude',
  checkedAt: chk,
}
