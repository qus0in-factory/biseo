// CLI Model Bucket label to families. Grounded in the CLI contract labels
// and quota-pools.ts pool names only; unmatched pools stay unknown.
import type { AgyModelFamily } from './agy-model-family.js'
const table: Record<string, AgyModelFamily[]> = {
  'gemini models': ['gemini'],
  'claude and gpt models': ['claude', 'gpt'],
  'gemini 4 argon': ['argon']
}
const norm = (s: string): string => s.toLowerCase().trim().replace(/\s+/g, ' ')
const okFam = (f: string): f is AgyModelFamily =>
  f === 'argon' || f === 'gemini' || f === 'claude' || f === 'gpt'
export function cliPoolFamilies(pool: string): AgyModelFamily[] | null {
  const raw = process.env.BISEO_AGY_CLI_POOLS
  if (raw) {
    try {
      const hit = (JSON.parse(raw) as Record<string, string[]>)[norm(pool)]
      if (Array.isArray(hit) && hit.filter(okFam).length > 0) return hit.filter(okFam)
    } catch { /* keep defaults */ }
  }
  return table[norm(pool)] ?? null
}
