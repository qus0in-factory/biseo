import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
export function ollamaUsageResult(chk: string, metrics: any[], primaryPercent: number | null): ProviderUsage {
  const w: WindowUsage = { window: 'primary', usedPercent: primaryPercent, resetsAt: null, checkedAt: chk, limitReached: primaryPercent === 100, source: 'ollama-cloud' }
  return { provider: 'ollama', state: 'available', metrics, windows: [w], source: 'ollama-cloud', checkedAt: chk }
}
