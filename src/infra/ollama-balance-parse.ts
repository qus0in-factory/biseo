import type { UsageMetric } from '../domain/usage-types.js'
import { parseOllamaPct } from './ollama-balance-pct.js'
import { parseOllamaUsd } from './ollama-balance-usd.js'

export function parseOllamaBalance(data: any): UsageMetric[] {
  if (!data || typeof data !== 'object') return []
  return [...parseOllamaPct(data.included), ...parseOllamaUsd(data)]
}
