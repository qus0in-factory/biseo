import type { WindowUsage } from '../domain/usage-types.js'

export function makeGoWindow(w: string, win: any, chk: string): WindowUsage {
  const r = typeof win?.resetsAt === 'string' ? win.resetsAt : null
  const u = typeof win?.percent === 'number' ? win.percent : null
  const lim = Boolean(u !== null && u >= 100)
  return { window: w, usedPercent: u, resetsAt: r, checkedAt: chk, limitReached: lim, source: 'opencode-go' }
}
