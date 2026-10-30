import { isFreeLockSignal } from './opencode-free-markers.js'

export type FreeLock = { isLocked: boolean; resetsAt: string | null; checkedAt: string; source: string }

let state: FreeLock | null = null

export const getFreeLock = () => state
export const setFreeLock = (s: FreeLock | null) => { state = s }

export function recordFreeTurn(err?: string | null, st?: number | null, sec?: number | null, now = new Date()) {
  const lim = isFreeLockSignal(err, st)
  if (lim) {
    const s = typeof sec === 'number' && sec > 0 ? sec : 3600
    state = { isLocked: true, resetsAt: new Date(now.getTime() + s * 1000).toISOString(), checkedAt: now.toISOString(), source: 'locked' }
  } else if (st === 200) {
    state = { isLocked: false, resetsAt: null, checkedAt: now.toISOString(), source: 'unlocked' }
  }
}
