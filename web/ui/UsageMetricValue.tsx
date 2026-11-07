import type { UsageMetric } from '../domain/usage'
import { UsageMetricTimeLeft } from './UsageMetricTimeLeft'
import { UsageValueLine } from './UsageValueLine'
import { UsageValueStatus } from './UsageValueStatus'
import { UsageMetricGauge } from './UsageMetricGauge'
import { usageMetricView } from './usage-metric-view'
export function UsageMetricValue({ provider, metric, remaining, limited }: { provider: string; metric: UsageMetric; remaining: boolean; limited?: boolean }) {
  const view = usageMetricView(provider, metric, remaining)
  return <UsageValueLine label={view.label} gauge={<UsageMetricGauge provider={provider} metric={metric} limited={limited} remaining={view.showRemaining} />} value={<UsageValueStatus text={view.text} used={view.used} window={view.window} limited={limited} />} timeLeft={<UsageMetricTimeLeft provider={provider} metric={metric} remaining={view.showRemaining} />} />
}
