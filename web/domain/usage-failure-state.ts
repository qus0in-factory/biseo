import type { UsageProvider } from './usage'
import { isAuthRequired } from './usage-auth-state'

export const isUsageFailure = (p: UsageProvider) =>
  p.reason === 'temporarily_unavailable' || p.reason === 'schema_error'

export const needsUsageNotice = (p: UsageProvider) => isAuthRequired(p) || isUsageFailure(p)
