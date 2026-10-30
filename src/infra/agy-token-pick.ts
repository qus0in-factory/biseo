import { isAgyTokenFresh, type AgyTokenFile } from './agy-token-file.js'
import { storeAgyMemToken } from './agy-token-memory.js'
import { agyOk, type AgyResolved } from './agy-token-result.js'

export function pickFreshAgyToken(list: Array<AgyTokenFile | null>, nowMs: number, skew: number): AgyTokenFile | null {
  return list.find((t) => t && isAgyTokenFresh(t.expiresAt, nowMs, skew)) ?? null
}

export function keepAgyToken(t: AgyTokenFile): AgyResolved {
  storeAgyMemToken({ access: t.access, expiresAt: t.expiresAt, refresh: t.refresh })
  return agyOk(t.access, false)
}
