import type { ProviderUsage } from '../domain/usage-types.js'
import { getProviderSnapshot, setProviderSnapshot, makeStaleUsage } from './provider-snapshot-store.js'

export const getLastGrokSnapshot = () => getProviderSnapshot('grok')
export const setLastGrokSnapshot = (s: ProviderUsage | null) => { setProviderSnapshot('grok', s) }

export function makeStaleGrokUsage(last: ProviderUsage | null, reason = 'auth_required'): ProviderUsage {
  return makeStaleUsage('grok', last, reason)
}
