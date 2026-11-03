import type { WindowUsage } from '../domain/usage-types.js'
import { detectUsageWindow } from '../../shared/usage-window-detect.js'
import { whamReset } from './codex-wham-reset.js'

export function hasWhamWindow(win: any): boolean {
  if (!win || typeof win !== 'object') return false
  return typeof win.limit_window_seconds === 'number'
    || typeof win.used_percent === 'number'
    || typeof win.reset_at === 'number'
    || typeof win.reset_after_seconds === 'number'
}

export function makeWhamWindow(win: any, chk: string): WindowUsage {
  const w = detectUsageWindow(win?.limit_window_seconds)
  const r = whamReset(win, chk)
  const u = Number.isFinite(win?.used_percent) ? win.used_percent : null
  const lim = Boolean(u !== null && u >= 100)
  return { window: w, usedPercent: u, resetsAt: r, checkedAt: chk, limitReached: lim, source: 'codex' }
}
