import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { makeGoWindow } from './opencode-go-window.js'

export function parseOpencodeGo(data: any, now = new Date()): ProviderUsage {
  if (!data?.usage) return unknownUsage('opencode-go')
  const u = data.usage
  const chk = now.toISOString()
  const p = makeGoWindow('primary', u.rolling, chk)
  const s = makeGoWindow('secondary', u.weekly, chk)
  const pAct = Boolean(p.resetsAt && Date.parse(p.resetsAt) > now.getTime())
  const sAct = Boolean(s.resetsAt && Date.parse(s.resetsAt) > now.getTime())
  const lim = Boolean((p.limitReached && pAct) || (s.limitReached && sAct))
  const state = lim ? 'limited' : 'available'
  return { provider: 'opencode-go', state, windows: [p, s] }
}
