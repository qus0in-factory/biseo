import { isAgyTokenFresh } from './agy-token-file.js'
import { loadStoredAgyToken } from './agy-token-source.js'
import { renewAgyToken } from './agy-token-renew.js'
import { agyRefreshConfig } from './agy-token-config.js'
import { agyOk, type AgyResolved } from './agy-token-result.js'
import { loadAgyMemToken } from './agy-token-memory.js'
import { pickFreshAgyToken, keepAgyToken } from './agy-token-pick.js'

export async function settleAgyToken(nowMs: number): Promise<AgyResolved> {
  const skew = agyRefreshConfig().skewMs
  const hit = loadAgyMemToken()
  if (hit?.expiresAt != null && isAgyTokenFresh(hit.expiresAt, nowMs, skew)) return agyOk(hit.access, false)
  const stored = await loadStoredAgyToken()
  const live = pickFreshAgyToken([stored.keychain, stored.file], nowMs, skew)
  if (live) return keepAgyToken(live)
  const fallback = hit?.refresh ?? stored.keychain?.refresh ?? stored.file?.refresh ?? null
  return renewAgyToken(fallback, nowMs)
}
