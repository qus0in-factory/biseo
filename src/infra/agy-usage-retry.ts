import type { AgyGroup } from './agy-quota-types.js'
import { clearAgyTokenCache } from './agy-token.js'
import { readAgyTokenFile } from './agy-token-file.js'
import { renewAgyFileToken } from './agy-token-renew.js'
import { fetchAgySummary } from './agy-summary-fetch.js'
import { fetchAgyModelGroups } from './agy-quota-fetch.js'
import { mergeAgyGroups } from './agy-usage-merge.js'

export async function loadAgyGroups(token: string, probe: { unauthorized: boolean }): Promise<AgyGroup[]> {
  const [s, d] = await Promise.all([fetchAgySummary(token, probe), fetchAgyModelGroups(token, probe)])
  return mergeAgyGroups(s, d)
}

export async function retryAgyGroups(now: Date): Promise<AgyGroup[] | null> {
  clearAgyTokenCache()
  const next = await renewAgyFileToken(await readAgyTokenFile(), now.getTime())
  if (!next.token) return null
  const retry = await loadAgyGroups(next.token, { unauthorized: false })
  return retry.length > 0 ? retry : null
}
