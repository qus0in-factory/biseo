import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { balancePercent } from './ollama-balance-percent.js'

export function ollamaUsageResult(chk: string, metrics: any[]): ProviderUsage {
  const inc = metrics.find((m: any) => m.id === 'included_balance')
  const pct = balancePercent(inc?.used ?? null, inc?.limit ?? null)
  const w: WindowUsage = { window: 'primary', usedPercent: pct, resetsAt: inc?.resetsAt ?? null, checkedAt: chk, limitReached: pct === 100, source: 'ollama-local' }
  return { provider: 'ollama', state: 'available', metrics, windows: [w], source: 'ollama-local', checkedAt: chk }
}
