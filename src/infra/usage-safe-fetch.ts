import type { ProviderUsage } from '../domain/usage-types.js'
import { unknownUsage } from '../domain/usage-unknown.js'
import { getProviderSnapshot, setProviderSnapshot, makeStaleUsage } from './provider-snapshot-store.js'

export async function safeFetch(name: string, fn: (now: Date) => Promise<ProviderUsage>, now: Date): Promise<ProviderUsage> {
  try {
    const res = await fn(now)
    if (res.state !== 'unknown' && res.reason !== 'auth_required') {
      setProviderSnapshot(name, res)
      return res
    }
    if (res.reason === 'auth_required' || res.reason === 'auth_failed' || res.reason === 'agy_auth_expired') {
      const snap = getProviderSnapshot(name)
      if (snap) return makeStaleUsage(name, snap, 'auth_required')
      return { ...res, reason: 'auth_required' }
    }
    return res
  } catch {
    return unknownUsage(name)
  }
}
