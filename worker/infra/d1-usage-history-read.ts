import type { D1Database } from '@cloudflare/workers-types'
import type { UsageHistoryPoint } from '../../shared/usage-history.js'

export async function readHistory(db: D1Database, provider: string, cutoff: number) {
  const result = await db.prepare(
    'SELECT provider,observed,five,week,fiveReset,weekReset FROM usage_history WHERE provider = ? AND observed >= ? ORDER BY observed',
  ).bind(provider, cutoff).all<UsageHistoryPoint>()
  return result.results ?? []
}
