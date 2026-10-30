import type { AgyGroup } from './agy-quota-types.js'
import { fetchAgySummary } from './agy-summary-fetch.js'
import { fetchAgyModelGroups } from './agy-quota-fetch.js'
import { mergeAgyGroups } from './agy-usage-merge.js'

export async function loadAgyGroups(token: string, probe: { unauthorized: boolean }): Promise<AgyGroup[]> {
  const [s, d] = await Promise.all([fetchAgySummary(token, probe), fetchAgyModelGroups(token, probe)])
  return mergeAgyGroups(s, d)
}
