import type { ProviderUsage, WindowUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { makeAgyWindow } from './agy-usage-window.js'

export function parseAgyUsage(data: any, now = new Date()): ProviderUsage {
  const buckets: any[] = data?.groups?.[0]?.buckets
  if (!Array.isArray(buckets) || buckets.length === 0) return unknownUsage('agy')
  const chk = now.toISOString()
  const b5h = buckets.find((b: any) => b.window === '5h' || b.bucketId === '3p-5h')
  const bW = buckets.find((b: any) => b.window === 'weekly' || b.bucketId === '3p-weekly')

  const windows: WindowUsage[] = []
  if (b5h) windows.push(makeAgyWindow('primary', b5h, chk))
  if (bW) windows.push(makeAgyWindow('secondary', bW, chk))

  const isLim = windows.some(w => {
    if (!w.limitReached) return false
    return !w.resetsAt || Date.parse(w.resetsAt) > now.getTime()
  })

  return { provider: 'agy', state: isLim ? 'limited' : 'available', windows }
}
