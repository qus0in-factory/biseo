import type { AgyGroup } from './agy-quota-types.js'

const key = (g: AgyGroup) => g.displayName.trim().toLowerCase().replace(/\s+/g, ' ')

export function mergeAgyGroups(summary: AgyGroup[], derived: AgyGroup[]): AgyGroup[] {
  const groups = Array.isArray(summary) ? [...summary] : []
  const seen = new Set(groups.map(key))
  for (const group of Array.isArray(derived) ? derived : []) {
    const k = key(group)
    if (seen.has(k)) continue
    groups.push(group)
    seen.add(k)
  }
  return groups
}
