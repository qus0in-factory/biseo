export const usageReport = {
  updatedAt: '2026-10-29T11:00:00Z',
  providers: [
    { provider: 'codex', state: 'limited', windows: [
      { window: 'primary', usedPercent: 42, resetsAt: '2026-10-29T12:00:00Z', checkedAt: '2026-10-29T11:00:00Z', limitReached: true, source: 'codex' },
      { window: 'secondary', usedPercent: null, resetsAt: null, checkedAt: '2026-10-29T11:00:00Z', limitReached: false, source: 'codex' },
    ] },
    { provider: 'claude', state: 'unknown', windows: [] },
  ],
}
export const oneWindow = { providers: [{ provider: 'codex', state: 'available', windows: [{ window: 'primary', usedPercent: 7, resetsAt: null, checkedAt: '2026-10-29T11:00:00Z', limitReached: false, source: 'codex' }] }] }
