import type { UsageMetric } from '../domain/usage-types.js'
export function parseOllamaTotalsTokens(data: any): UsageMetric[] {
  const m: UsageMetric[] = []
  const totals = data?.totals
  if (totals && typeof totals === 'object') {
    if (typeof totals.input_tokens === 'number') m.push({ id: 'input_tokens', label: 'Input Tokens', unit: 'tokens', used: totals.input_tokens, limit: null, remaining: null, resetsAt: null })
    if (typeof totals.output_tokens === 'number') m.push({ id: 'output_tokens', label: 'Output Tokens', unit: 'tokens', used: totals.output_tokens, limit: null, remaining: null, resetsAt: null })
    if (typeof totals.cached_input_tokens === 'number') m.push({ id: 'cached_input_tokens', label: 'Cached Input Tokens', unit: 'tokens', used: totals.cached_input_tokens, limit: null, remaining: null, resetsAt: null })
  }
  return m
}
