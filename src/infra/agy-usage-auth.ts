import type { AgyGroup } from './agy-quota-types.js'
import { resolveAgyToken } from './agy-token.js'
import { loadAgyGroups } from './agy-usage-load.js'
import { retryAgyGroups } from './agy-usage-retry.js'

export async function fetchAgyGroups(now = new Date()): Promise<AgyGroup[] | null> {
  const first = await resolveAgyToken(now)
  if (!first.token) return null
  const probe = { unauthorized: false }
  const groups = await loadAgyGroups(first.token, probe)
  if (probe.unauthorized && !first.refreshed) return retryAgyGroups(now)
  if (groups.length > 0) return groups
  if (!probe.unauthorized) return groups
  if (first.refreshed) return null
  return retryAgyGroups(now)
}
