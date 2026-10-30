import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'
import { parseOllamaBalance } from './ollama-balance-parse.js'

export async function fetchOllamaBalanceMetrics(authorize: (c: string) => string, ts: number): Promise<any[]> {
  const uri = `/api/balance?ts=${ts}`
  const metrics: any[] = []
  try {
    const res = await fetch(`${ep().ollamaCloudBalance.replace(/\/api\/balance$/, '')}${uri}`, {
      headers: { Authorization: authorize(`GET,${uri}`), Accept: 'application/json' },
      signal: AbortSignal.timeout(to())
    })
    if (res.ok) {
      const data = await res.json()
      metrics.push(...parseOllamaBalance(data))
    }
  } catch { /* ignore */ }
  return metrics
}
