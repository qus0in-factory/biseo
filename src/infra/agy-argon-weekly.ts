import type { AgyGroup } from './agy-quota-types.js'
import { cliPoolFamilies } from './agy-cli-pools.js'

const argon = (g: AgyGroup) =>
  g.families?.includes('argon') || cliPoolFamilies(g.displayName)?.includes('argon')
const weekly = (g: AgyGroup) => g.buckets?.find(b =>
  b.window === 'weekly' || b.bucketId === 'weekly')

export const hasArgonWeekly = (groups: AgyGroup[]) =>
  groups.some(g => argon(g) && typeof weekly(g)?.remainingFraction === 'number')

export function addArgonWeekly(groups: AgyGroup[], cli: AgyGroup[] | null): AgyGroup[] {
  if (hasArgonWeekly(groups)) return groups
  const bucket = cli?.filter(argon).map(weekly).find(b =>
    typeof b?.remainingFraction === 'number')
  const target = groups.find(argon)
  const v = bucket ?? { bucketId: 'weekly', window: 'weekly' }
  if (target) return groups.map(g => g === target
    ? { ...g, buckets: [...g.buckets.filter(b => b !== weekly(g)), v] } : g)
  return [...groups, { displayName: 'Gemini 4 Argon', families: ['argon'], buckets: [v] }]
}
