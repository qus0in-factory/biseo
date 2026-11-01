import type { D1Database } from '@cloudflare/workers-types'
import type { UsageHistoryPoint } from '../../shared/usage-history.js'

export async function writeHistory(db: D1Database, points: UsageHistoryPoint[], cutoff: number) {
  const statements = points.map(point => db.prepare(
    'INSERT OR IGNORE INTO usage_history (provider,observed,five,week,fiveReset,weekReset) VALUES (?,?,?,?,?,?)',
  ).bind(point.provider, point.observed, point.five, point.week, point.fiveReset, point.weekReset))
  statements.push(db.prepare('DELETE FROM usage_history WHERE observed < ?').bind(cutoff))
  await db.batch(statements)
}
