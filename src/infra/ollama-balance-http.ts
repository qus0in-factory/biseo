import type { UsageMetric } from '../domain/usage-types.js'
import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'
import { parseOllamaBalance } from './ollama-balance-parse.js'

export async function fetchOllamaBalanceMetrics(): Promise<{ metrics: UsageMetric[], reason?: string }> {
  try {
    const res = await fetch(ep().ollama, { signal: AbortSignal.timeout(to()) })
    if (!res.ok) return { metrics: [], reason: res.status === 404 ? 'unsupported' : res.status === 401 || res.status === 403 ? 'auth_required' : 'temporarily_unavailable' }
    const metrics = parseOllamaBalance(await res.json())
    return { metrics, reason: metrics.length ? undefined : 'balance_unavailable' }
  } catch { return { metrics: [], reason: 'temporarily_unavailable' } }
}
