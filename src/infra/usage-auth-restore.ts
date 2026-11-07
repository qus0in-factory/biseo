import type { ProviderUsage } from '../domain/usage-types.js'
import { getProviderSnapshot, makeStaleUsage } from './provider-snapshot-store.js'

export function restoreUsageAuth(name: string, res: ProviderUsage): ProviderUsage {
  if (!['auth_required', 'auth_failed', 'agy_auth_expired'].includes(res.reason ?? '')) return res
  const snap = getProviderSnapshot(name)
  return snap ? makeStaleUsage(name, snap, 'auth_required') : { ...res, reason: 'auth_required' }
}
