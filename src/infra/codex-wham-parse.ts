import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { windowsToMetrics } from '../domain/usage-metric-compat.js'
import { makeWhamWindow, isWhamWindowPresent } from './codex-wham-window.js'

export function parseCodexWham(data: any, now = new Date()): ProviderUsage {
  if (!data?.rate_limit) return unknownUsage('codex')
  const rl = data.rate_limit
  const chk = now.toISOString()
  const raw = [rl.primary_window, rl.secondary_window].filter(isWhamWindowPresent)
  const windows: WindowUsage[] = raw.map(w => makeWhamWindow(w, chk))
  const lim = Boolean(rl.limit_reached || windows.some(w => w.limitReached && w.resetsAt && Date.parse(w.resetsAt) > now.getTime()))
  const state = lim ? 'limited' : windows.length === 0 || windows.every(w => w.usedPercent === null) ? 'unknown' : 'available'
  return { provider: 'codex', state, metrics: windowsToMetrics(windows), windows }
}
