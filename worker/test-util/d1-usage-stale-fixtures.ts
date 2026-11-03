export const initialStaleReport = {
  providers: [
    {
      provider: 'codex', state: 'available',
      windows: [
        { window: '5h', usedPercent: 42, resetsAt: '2026-11-02T16:00:00Z' },
        { window: 'w', usedPercent: 15, resetsAt: '2026-11-08T00:00:00Z' }
      ]
    },
    {
      provider: 'grok', state: 'available',
      windows: [{ window: 'status', usedPercent: 25, resetsAt: '2026-11-02T17:00:00Z' }]
    }
  ]
}

export const authStaleReport = {
  providers: [
    { provider: 'codex', state: 'unknown', reason: 'auth_required', metrics: [], windows: [] },
    { provider: 'grok', state: 'unknown', reason: 'auth_required', metrics: [], windows: [] }
  ]
}
