import type { WindowUsage } from '../domain/usage-types.js'

export function makeFreeWindow(chk: string, lim: boolean, reset: string | null): WindowUsage {
  return { window: 'primary', usedPercent: lim ? 100 : null, resetsAt: reset, checkedAt: chk, limitReached: lim, source: 'opencode-free' }
}
