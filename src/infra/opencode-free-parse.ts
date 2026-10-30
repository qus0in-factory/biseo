import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { windowsToMetrics as m } from '../domain/usage-metric-compat.js'
import { isFreeLockSignal } from './opencode-free-markers.js'
import { makeFreeWindow } from './opencode-free-window.js'

export function parseOpencodeFree(status: number, headers: Headers, data: any, now = new Date()): ProviderUsage {
  const chk = now.toISOString()
  if (status === 200) {
    const w = [makeFreeWindow(chk, false, null)]
    return { provider: 'opencode-free', state: 'available', metrics: m(w), windows: w }
  }
  if (isFreeLockSignal(data?.error?.type, status)) {
    const raw = headers.get('retry-after')
    const sec = raw && /^\d+$/.test(raw) ? Number(raw) : 3600
    const w = [makeFreeWindow(chk, true, new Date(now.getTime() + sec * 1000).toISOString())]
    return { provider: 'opencode-free', state: 'limited', metrics: m(w), windows: w }
  }
  return unknownUsage('opencode-free')
}
