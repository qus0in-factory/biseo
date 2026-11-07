import type { ProviderUsage } from '../domain/usage-types.js'
import { readOpencodeDbCredential as read } from './opencode-db-token.js'
import { getLastGrokSnapshot as snap, setLastGrokSnapshot as setSnap, makeStaleGrokUsage as stale } from './grok-snapshot-store.js'
import { queryGrokBilling as qry } from './grok-billing-query.js'

export async function fetchGrokUsage(now = new Date(), readAccess = read): Promise<ProviderUsage> {
  const token = readAccess('xai')
  if (!token) return stale(snap(), 'auth_required')
  const result = await qry(token, now)
  if ('reason' in result) return stale(snap(), result.reason)
  setSnap(result.usage)
  return result.usage
}
