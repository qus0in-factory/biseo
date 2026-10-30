import type { ProviderUsage } from '../domain/usage-types.js'
import { readOpencodeDbAuth as auth } from './opencode-db-token.js'
import { getMemoryGrokToken as mem, refreshGrokToken as ref } from './grok-token-refresh.js'
import { getLastGrokSnapshot as snap, setLastGrokSnapshot as setSnap, makeStaleGrokUsage as stale } from './grok-snapshot-store.js'
import { queryGrokBilling as qry } from './grok-billing-query.js'

export async function fetchGrokUsage(now = new Date()): Promise<ProviderUsage> {
  try {
    const c = auth('xai'), t1 = mem() ?? c.access
    if (t1) {
      const r1 = await qry(t1, now)
      if (r1 && r1.state !== 'unknown') { setSnap(r1); return r1 }
    }
    if (c.refresh) {
      const t2 = await ref(c.refresh)
      if (t2) {
        const r2 = await qry(t2, now)
        if (r2 && r2.state !== 'unknown') { setSnap(r2); return r2 }
      }
    }
    return stale(snap())
  } catch {
    return stale(snap())
  }
}
