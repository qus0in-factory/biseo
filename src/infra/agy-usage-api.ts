import type { AgyGroup } from './agy-quota-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { parseAgyUsage } from './agy-usage-parse.js'
import { loadAgyCliGroups } from './agy-cli-fallback.js'
import { addArgonWeekly, hasArgonWeekly } from './agy-argon-weekly.js'

export async function parseAgyApi(groups: AgyGroup[], now: Date) {
  if (hasArgonWeekly(groups)) return parseAgyUsage({ groups }, now)
  const cli = await loadAgyCliGroups(now.getTime())
  if (!groups.length && !cli?.length) return unknownUsage('agy')
  return parseAgyUsage({ groups: addArgonWeekly(groups.length ? groups : cli!, cli) }, now)
}
