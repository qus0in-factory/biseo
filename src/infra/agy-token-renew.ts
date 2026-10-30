import type { AgyTokenFile } from './agy-token-file.js'
import { refreshAgyToken } from './agy-token-refresh.js'
import { storeAgyMemToken } from './agy-token-memory.js'
import { agyOk, agyExpired, type AgyResolved } from './agy-token-result.js'

export async function renewAgyFileToken(file: AgyTokenFile | null, nowMs: number): Promise<AgyResolved> {
  const next = file?.refresh ? await refreshAgyToken(file.refresh, nowMs) : null
  if (!next) return agyExpired()
  storeAgyMemToken(next)
  return agyOk(next.access, true)
}
