import type { UsageWindow } from '../domain/usage'
import { usageWindowDisplay } from './usageWindowDisplay'
import { UsageTimeLeft } from './UsageTimeLeft'
import { UsageValueLine } from './UsageValueLine'
import { UsageValueStatus } from './UsageValueStatus'
import { UsageGauge } from './UsageGauge'

export function UsageWindowValue({
  provider,
  value,
  remaining = true,
}: {
  provider: string
  value: UsageWindow
  remaining?: boolean
}) {
  const { name, text, stale } = usageWindowDisplay(provider, value, remaining)
  return (
    <UsageValueLine
      label={name}
      gauge={<UsageGauge used={value.usedPercent} window={value.window} limited={value.limitReached} stale={stale} />}
      value={<UsageValueStatus text={text} used={value.usedPercent} window={value.window} limited={value.limitReached} />}
      timeLeft={<UsageTimeLeft label={name} startsAt={value.startsAt} resetsAt={value.resetsAt} remaining={remaining} />}
    />
  )
}
