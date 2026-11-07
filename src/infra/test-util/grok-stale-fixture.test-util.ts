export const staleGrokUsage = {
  provider: 'grok', state: 'available' as const,
  metrics: [{ id: 'p', label: 'p', unit: 'percent', used: 45, limit: 100, remaining: 55, resetsAt: null }],
  windows: [{ window: 'p', usedPercent: 45, resetsAt: null, checkedAt: null, limitReached: false, source: 'grok' }]
}
