import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { collectClaudeItems } from './claude-oauth-items.js'

export function parseClaudeUsage(data: any, now = new Date()): ProviderUsage {
  if (!data || typeof data !== 'object') return unknownUsage('claude')
  const chk = now.toISOString()
  const { windows, metrics } = collectClaudeItems(data, chk)
  if (metrics.length === 0 && windows.length === 0) return unknownUsage('claude')
  const isLim = metrics.some(m => {
    if (m.used === null || m.used < 100) return false
    return !m.resetsAt || Date.parse(m.resetsAt) > now.getTime()
  })
  return { provider: 'claude', state: isLim ? 'limited' : 'available', metrics, windows, source: 'claude', checkedAt: chk }
}
