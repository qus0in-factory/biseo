import { loadAgyMemToken, storeAgyMemToken } from './agy-token-memory.js'
import { refreshAgyToken } from './agy-token-refresh.js'
import { agyOk, agyExpired, type AgyResolved } from './agy-token-result.js'

let rf: Promise<AgyResolved> | null = null

export function renewAgyToken(refresh: string | null, nowMs: number): Promise<AgyResolved> {
  if (!refresh) return Promise.resolve(agyExpired())
  if (!rf) {
    rf = (async () => {
      const next = await refreshAgyToken(refresh, nowMs)
      if (!next) return agyExpired()
      storeAgyMemToken({ access: next.access, expiresAt: next.expiresAt, refresh: next.refresh ?? refresh })
      return agyOk(next.access, true)
    })()
    rf.then(() => { rf = null }, () => { rf = null })
  }
  return rf
}
