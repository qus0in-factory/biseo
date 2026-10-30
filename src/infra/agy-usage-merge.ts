import type { AgyGroup } from './agy-quota-types.js'

const key = (g: AgyGroup) => g.displayName.trim().toLowerCase().replace(/\s+/g, ' ')

export function mergeAgyGroups(summary: AgyGroup[], derived: AgyGroup[]): AgyGroup[] {
  const groups = Array.isArray(summary) ? [...summary] : []
  const byKey = new Map(groups.map((g) => [key(g), g]))
  for (const group of Array.isArray(derived) ? derived : []) {
    const k = key(group)
    const hit = byKey.get(k)
    // A summary pool keeps its own buckets but inherits the families detected on the
    // quota model ids of the same pool; pools without a match stay unknown.
    if (hit) {
      if (!hit.families?.length) hit.families = [...(group.families ?? [])]
      continue
    }
    groups.push(group)
    byKey.set(k, group)
  }
  for (const g of groups) if (!g.families?.length) g.families = ['unknown']
  return groups
}
