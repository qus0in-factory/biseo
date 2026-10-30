import { readAgyTokenFile, isAgyTokenFresh } from './agy-token-file.js'
import { renewAgyFileToken } from './agy-token-renew.js'
import { agyRefreshConfig } from './agy-token-config.js'
import { agyOk, type AgyResolved } from './agy-token-result.js'
import { loadAgyMemToken, storeAgyMemToken, withAgyFlight, resetAgyTokenState } from './agy-token-memory.js'

export const clearAgyTokenCache = resetAgyTokenState

async function settle(nowMs: number): Promise<AgyResolved> {
  const skew = agyRefreshConfig().skewMs
  const hit = loadAgyMemToken()
  if (hit && isAgyTokenFresh(hit.expiresAt, nowMs, skew)) return agyOk(hit.access, false)
  const file = await readAgyTokenFile()
  if (file && isAgyTokenFresh(file.expiresAt, nowMs, skew)) {
    storeAgyMemToken({ access: file.access, expiresAt: file.expiresAt })
    return agyOk(file.access, false)
  }
  return renewAgyFileToken(file, nowMs)
}

export const resolveAgyToken = (now = new Date()) => withAgyFlight(() => settle(now.getTime()))
