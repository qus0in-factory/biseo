import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { windowsToMetrics } from '../domain/usage-metric-compat.js'
import { makeWhamWindow } from './codex-wham-window.js'

export function parseCodexWham(data: any, now = new Date()): ProviderUsage {
  if (!data?.rate_limit) return unknownUsage('codex')
  const rl = data.rate_limit
  const chk = now.toISOString()
  const p = makeWhamWindow('primary', rl.primary_window, chk)
  const s = makeWhamWindow('secondary', rl.secondary_window, chk)
  const pAct = Boolean(p.resetsAt && Date.parse(p.resetsAt) > now.getTime())
  const sAct = Boolean(s.resetsAt && Date.parse(s.resetsAt) > now.getTime())
  const lim = Boolean(rl.limit_reached || (p.limitReached && pAct) || (s.limitReached && sAct))
  const state = lim ? 'limited' : 'available'
  const windows = [p, s]
  return { provider: 'codex', state, metrics: windowsToMetrics(windows), windows }
}
