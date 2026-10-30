import type { WindowUsage, UsageMetric } from '../domain/usage-types.js'
import { makeAgyWindow } from './agy-usage-window.js'
import { makeAgyMetric } from './agy-usage-metric.js'

export function collectAgyItems(groups: any[], chk: string) {
  const metrics: UsageMetric[] = [], windows: WindowUsage[] = []
  for (const g of groups) {
    const gn = g?.displayName ?? 'Default'
    const fams = Array.isArray(g?.families) ? (g.families as string[]) : []
    for (const b of (Array.isArray(g?.buckets) ? g.buckets : [])) metrics.push(makeAgyMetric(gn, b, fams))
  }
  const f = groups[0]?.buckets ?? []
  const b5h = f.find((b: any) => b.window === '5h' || b.bucketId === '3p-5h')
  const bW = f.find((b: any) => b.window === 'weekly' || b.bucketId === '3p-weekly')
  if (b5h) windows.push(makeAgyWindow('primary', b5h, chk))
  if (bW) windows.push(makeAgyWindow('secondary', bW, chk))
  return { metrics, windows }
}
