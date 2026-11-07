import type { AgyGroup } from './agy-quota-types.js'
import { agyCliConfig } from './agy-cli-config.js'
import { runAgyCli } from './agy-cli-run.js'
import { parseAgyCliTsv } from './agy-cli-tsv.js'

let cache: { at: number, groups: AgyGroup[] | null } | null = null
let flight: Promise<AgyGroup[] | null> | null = null

export const resetAgyCliCache = (): void => { cache = null; flight = null }

export async function loadAgyCliGroups(nowMs: number): Promise<AgyGroup[] | null> {
  const c = agyCliConfig()
  if (!c.enabled) return null
  const ttl = Math.max(c.cacheMs, c.minIntervalMs)
  if (cache && nowMs - cache.at < ttl) return cache.groups
  if (!flight) flight = runAgyCli().then((out) => {
    const groups = out === null ? null : parseAgyCliTsv(out, nowMs)
    cache = { at: nowMs, groups }
    return groups
  }).finally(() => { flight = null })
  return flight
}
