import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { makeGoWindow } from './opencode-go-window.js'

export function parseOpencodeGo(data: any, now = new Date()): ProviderUsage {
  if (!data?.usage) return unknownUsage('opencode-go')
  const u = data.usage
  const chk = now.toISOString()
  const wins: WindowUsage[] = []
  if (u.rolling) wins.push(makeGoWindow('primary', u.rolling, chk))
  if (u.weekly) wins.push(makeGoWindow('secondary', u.weekly, chk))
  if (u.monthly) wins.push(makeGoWindow('monthly', u.monthly, chk))

  const lim = wins.some(w => {
    if (!w.limitReached) return false
    return !w.resetsAt || Date.parse(w.resetsAt) > now.getTime()
  })
  return { provider: 'opencode-go', state: lim ? 'limited' : 'available', windows: wins }
}
