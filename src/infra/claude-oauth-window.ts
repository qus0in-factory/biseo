import type { WindowUsage } from '../domain/usage-types.js'

export function makeClaudeWindow(w: 'primary' | 'secondary', win: any, chk: string): WindowUsage {
  const r = typeof win?.resets_at === 'string' ? win.resets_at : null
  const u = typeof win?.utilization === 'number' ? win.utilization : null
  const lim = Boolean(u !== null && u >= 100)
  return { window: w, usedPercent: u, resetsAt: r, checkedAt: chk, limitReached: lim, source: 'claude' }
}
