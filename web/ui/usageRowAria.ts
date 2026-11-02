import type { UsageProvider } from '../domain/usage'
import { isAuthRequired } from '../domain/usage-auth-state.js'
import r from '../resources.json'

export { isAuthRequired, isAuthRequired as isAuth }
export const usageRowAria = (p: UsageProvider): string | undefined =>
  isAuthRequired(p) ? (r as Record<string, string>).usageAuthStaleAria.replace('{provider}', p.provider) : undefined
export const usageStaleCls = (p: UsageProvider) => (isAuthRequired(p) ? 'border-dashed bg-muted/30' : '')
