import type { WindowUsage } from '../domain/usage-types.js'

export function makeWhamWindow(w: 'primary' | 'secondary', win: any, chk: string): WindowUsage {
  const r = win?.reset_at ? new Date(win.reset_at * 1000).toISOString() : null
  const u = typeof win?.used_percent === 'number' ? win.used_percent : null
  const lim = Boolean(u !== null && u >= 100)
  return { window: w, usedPercent: u, resetsAt: r, checkedAt: chk, limitReached: lim, source: 'codex' }
}
