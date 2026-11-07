import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'

const live = (at: string | null, now: number) => !!at && Date.parse(at) > now

export function openClaude(u: ProviderUsage, now: Date): ProviderUsage {
  const t = now.getTime()
  const windows = u.windows.filter(w => live(w.resetsAt, t))
  const metrics = u.metrics.filter(w => live(w.resetsAt, t))
  if (windows.length === u.windows.length && metrics.length === u.metrics.length) return u
  if (!windows.length && u.state !== 'unknown') return unknownUsage(u.provider)
  return { ...u, windows, metrics }
}
