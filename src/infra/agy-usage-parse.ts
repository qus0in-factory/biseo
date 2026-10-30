import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { collectAgyItems } from './agy-usage-items.js'

export function parseAgyUsage(data: any, now = new Date()): ProviderUsage {
  const groups: any[] = data?.groups
  if (!Array.isArray(groups) || groups.length === 0) return unknownUsage('agy')
  const chk = now.toISOString()
  const { metrics, windows } = collectAgyItems(groups, chk)
  const isLim = metrics.some(m => {
    if (m.used === null || m.used < 100) return false
    return !m.resetsAt || Date.parse(m.resetsAt) > now.getTime()
  })
  return { provider: 'agy', state: isLim ? 'limited' : 'available', metrics, windows, source: 'antigravity', checkedAt: chk }
}
