import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { fetchOllamaBalanceMetrics } from './ollama-balance-http.js'
import { ollamaUsageResult } from './ollama-usage-result.js'

export async function fetchOllamaUsage(now = new Date()): Promise<ProviderUsage> {
  const { metrics, reason } = await fetchOllamaBalanceMetrics()
  if (metrics.length === 0) return { ...unknownUsage('ollama', reason), checkedAt: now.toISOString(), source: 'ollama-local' }
  return ollamaUsageResult(now.toISOString(), metrics)
}
