import type { AgyGroup } from './agy-quota-types.js'
import { cliPoolFamilies } from './agy-cli-pools.js'

const key = (g: AgyGroup) => g.displayName.trim().toLowerCase().replace(/\s+/g, ' ')

export function mergeAgyGroups(summary: AgyGroup[], derived: AgyGroup[]): AgyGroup[] {
  const groups = Array.isArray(summary) ? [...summary] : []
  const byKey = new Map(groups.map((g) => [key(g), g]))
  for (const group of Array.isArray(derived) ? derived : []) {
    const k = key(group)
    const hit = byKey.get(k)
    if (hit) {
      if (!hit.families?.length) hit.families = [...(group.families ?? [])]
      const s = hit.buckets[0] as any
      const d = group.buckets[0] as any
      if (s && d && typeof s.resetTime !== 'string' && typeof d.resetTime === 'string') s.resetTime = d.resetTime
      continue
    }
    groups.push(group)
    byKey.set(k, group)
  }
  for (const g of groups) if (!g.families?.length) g.families = cliPoolFamilies(g.displayName) ?? ['unknown']
  return groups
}
