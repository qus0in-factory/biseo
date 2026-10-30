import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { readOllamaAuthorize } from './ollama-usage-auth.js'
import { fetchOllamaCloudMetrics } from './ollama-cloud-http.js'
import { fetchOllamaBalanceMetrics } from './ollama-balance-http.js'
import { ollamaUsageResult } from './ollama-usage-result.js'

export async function fetchOllamaUsage(now = new Date()): Promise<ProviderUsage> {
  const chk = now.toISOString()
  const authorize = await readOllamaAuthorize()
  if (!authorize) return unknownUsage('ollama')
  const ts = Math.floor(now.getTime() / 1000)
  const { metrics: cloud, primaryPercent } = await fetchOllamaCloudMetrics(authorize, ts)
  const balance = await fetchOllamaBalanceMetrics(authorize, ts)
  const metrics = [...cloud, ...balance]
  if (metrics.length === 0) return unknownUsage('ollama')
  return ollamaUsageResult(chk, metrics, primaryPercent)
}
