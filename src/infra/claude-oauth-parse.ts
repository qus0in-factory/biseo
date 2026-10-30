import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { windowsToMetrics } from '../domain/usage-metric-compat.js'
import { makeClaudeWindow } from './claude-oauth-window.js'

export function parseClaudeUsage(data: any, now = new Date()): ProviderUsage {
  if (!data?.five_hour) return unknownUsage('claude')
  const chk = now.toISOString()
  const p = makeClaudeWindow('primary', data.five_hour, chk)
  const s = makeClaudeWindow('secondary', data.seven_day, chk)
  const pAct = Boolean(p.resetsAt && Date.parse(p.resetsAt) > now.getTime())
  const sAct = Boolean(s.resetsAt && Date.parse(s.resetsAt) > now.getTime())
  const lim = Boolean((p.limitReached && pAct) || (s.limitReached && sAct))
  const state = lim ? 'limited' : 'available'
  const windows = [p, s]
  return { provider: 'claude', state, metrics: windowsToMetrics(windows), windows }
}
