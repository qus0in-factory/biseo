import type { AgyGroup } from './agy-quota-types.js'
import { loadStoredAgyToken } from './agy-token-source.js'
import { loadAgyMemToken, resetAgyTokenState } from './agy-token-memory.js'
import { renewAgyToken } from './agy-token-renew.js'
import { loadAgyGroups } from './agy-usage-load.js'

export async function retryAgyGroups(now: Date): Promise<AgyGroup[] | null> {
  const keep = loadAgyMemToken()?.refresh ?? null
  resetAgyTokenState()
  const stored = await loadStoredAgyToken()
  const next = await renewAgyToken(stored.keychain?.refresh ?? stored.file?.refresh ?? keep, now.getTime())
  if (!next.token) return null
  const probe = { unauthorized: false }
  const retry = await loadAgyGroups(next.token, probe)
  if (probe.unauthorized) return null
  return retry.length > 0 ? retry : null
}
