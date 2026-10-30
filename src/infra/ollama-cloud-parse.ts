import type { UsageMetric } from '../domain/usage-types.js'
import { parseOllamaLimits } from './ollama-cloud-limits.js'
import { parseOllamaTotals } from './ollama-cloud-totals.js'
import { parseOllamaActivity } from './ollama-cloud-activity.js'
export function parseOllamaCloudUsage(data: any): UsageMetric[] {
  return [...parseOllamaLimits(data), ...parseOllamaTotals(data), ...parseOllamaActivity(data)]
}
export { parseOllamaBalance } from './ollama-balance-parse.js'
