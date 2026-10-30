import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { makeFreeWindow } from './opencode-free-window.js'

export function parseOpencodeFree(status: number, headers: Headers, data: any, now = new Date()): ProviderUsage {
  const chk = now.toISOString()
  if (status === 200) {
    return { provider: 'opencode-free', state: 'available', windows: [makeFreeWindow(chk, false, null)] }
  }
  if (status === 429 || data?.error?.type === 'FreeUsageLimitError') {
    const raw = headers.get('retry-after')
    const sec = raw && /^\d+$/.test(raw) ? Number(raw) : 3600
    const reset = new Date(now.getTime() + sec * 1000).toISOString()
    return { provider: 'opencode-free', state: 'limited', windows: [makeFreeWindow(chk, true, reset)] }
  }
  return unknownUsage('opencode-free')
}
