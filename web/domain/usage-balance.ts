import type { UsageMetric } from './usage'

export const BALANCE_METRIC_IDS = ['included_balance', 'purchased_balance'] as const

export const isBalanceMetric = (m: UsageMetric): boolean =>
  BALANCE_METRIC_IDS.includes(m.id as (typeof BALANCE_METRIC_IDS)[number])
