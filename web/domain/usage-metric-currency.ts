import type { UsageMetric } from './usage'
import { metricRemaining } from './metricRemaining.js'
import { formatCurrency } from './usage-currency.js'
import { isBalanceMetric } from './usage-balance.js'
import r from '../resources.json'
const R = r as Record<string, string>
export function formatCurrencyMetric(m: UsageMetric, unk: string, show: boolean): string {
  if (!show && isBalanceMetric(m)) {
    const rem = metricRemaining(m)
    return rem === null ? unk : `${R.usageBalance} ${formatCurrency({ ...m, remaining: rem }, unk, true)}`
  }
  return formatCurrency(m, unk, show)
}
