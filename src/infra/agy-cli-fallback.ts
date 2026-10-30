import type { AgyGroup } from './agy-quota-types.js'
import { agyCliConfig } from './agy-cli-config.js'
import { runAgyCli } from './agy-cli-run.js'
import { parseAgyCliTsv } from './agy-cli-tsv.js'

let cache: { at: number, groups: AgyGroup[] | null } | null = null

export const resetAgyCliCache = (): void => { cache = null }

export async function loadAgyCliGroups(nowMs: number): Promise<AgyGroup[] | null> {
  const c = agyCliConfig()
  if (!c.enabled) return null
  if (cache && nowMs - cache.at < c.cacheMs) return cache.groups
  const out = await runAgyCli()
  const groups = out === null ? null : parseAgyCliTsv(out, nowMs)
  cache = { at: nowMs, groups }
  return groups
}
