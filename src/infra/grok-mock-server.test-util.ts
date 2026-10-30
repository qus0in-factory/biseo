import { setMemoryGrokToken } from './grok-token-refresh.js'
import { setLastGrokSnapshot } from './grok-snapshot-store.js'

export const staleGrokUsage = {
  provider: 'grok', state: 'available' as const,
  metrics: [{ id: 'p', label: 'p', unit: 'percent', used: 45, limit: 100, remaining: 55, resetsAt: null }],
  windows: [{ window: 'p', usedPercent: 45, resetsAt: null, checkedAt: null, limitReached: false, source: 'grok' }]
}

export function initGrokMock(p: number, tok = 'exp') {
  setMemoryGrokToken(tok)
  setLastGrokSnapshot(null)
  process.env.BISEO_GROK_BILLING_URL = `http://127.0.0.1:${p}/billing`
  process.env.BISEO_GROK_REFRESH_URL = `http://127.0.0.1:${p}/token`
}

export function cleanGrokEnv() {
  delete process.env.BISEO_GROK_BILLING_URL
  delete process.env.BISEO_GROK_REFRESH_URL
}
