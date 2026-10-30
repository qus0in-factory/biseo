import type { UsageMetric } from '../domain/usage-types.js'
import { getUsageEndpoints as ep, getUsageTimeoutMs as to } from '../domain/usage-endpoints.js'
import { config } from '../config.js'
import { parseOllamaBalance } from './ollama-balance-parse.js'

export async function fetchOllamaBalanceMetrics(): Promise<UsageMetric[]> {
  try {
    const res = await fetch(ep().ollama, { signal: AbortSignal.timeout(to()) })
    if (!res.ok) return []
    return parseOllamaBalance(await res.json(), config.ollamaIncludedUsd)
  } catch { return [] }
}
