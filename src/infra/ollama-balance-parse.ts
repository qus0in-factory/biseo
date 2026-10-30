import type { UsageMetric } from '../domain/usage-types.js'
import { parseOllamaUsd } from './ollama-balance-usd.js'

export function parseOllamaBalance(data: any, defaultIncludedUsd?: number): UsageMetric[] {
  if (!data || typeof data !== 'object') return []
  return parseOllamaUsd(data, defaultIncludedUsd)
}
