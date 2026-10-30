import type { UsageMetric } from '../domain/usage-types.js'
import { parseOllamaTotalsCount } from './ollama-cloud-totals-count.js'
import { parseOllamaTotalsTokens } from './ollama-cloud-totals-tokens.js'
export function parseOllamaTotals(data: any): UsageMetric[] {
  return [...parseOllamaTotalsCount(data), ...parseOllamaTotalsTokens(data)]
}
