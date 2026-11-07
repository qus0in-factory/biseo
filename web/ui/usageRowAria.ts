import type { UsageProvider } from '../domain/usage'
import { isAuthRequired } from '../domain/usage-auth-state.js'
import { needsUsageNotice } from '../domain/usage-failure-state'
import r from '../resources.json'

export { isAuthRequired, isAuthRequired as isAuth }
export const usageRowAria = (p: UsageProvider): string | undefined =>
  needsUsageNotice(p) ? (isAuthRequired(p) ? r.usageAuthStaleAria : r.usageFailureStaleAria).replace('{provider}', p.provider) : undefined
export const usageStaleCls = (p: UsageProvider) => (needsUsageNotice(p) ? 'border-dashed bg-muted/30' : '')
