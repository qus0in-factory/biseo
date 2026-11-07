import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { setProviderSnapshot } from './provider-snapshot-store.js'
import { restoreUsageAuth } from './usage-auth-restore.js'

export async function safeFetch(name: string, fn: (now: Date) => Promise<ProviderUsage>, now: Date): Promise<ProviderUsage> {
  try {
    const res = await fn(now)
    if (name === 'claude' || res.windows.some(w => w.source?.endsWith('-stale'))) return res
    if (res.state !== 'unknown' && res.reason !== 'auth_required') {
      setProviderSnapshot(name, res)
      return res
    }
    return restoreUsageAuth(name, res)
  } catch {
    return unknownUsage(name)
  }
}
