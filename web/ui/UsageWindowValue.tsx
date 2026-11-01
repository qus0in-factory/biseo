import type { UsageWindow } from '../domain/usage'
import { usagePercentText, usageWindowName } from '../domain/usage-text'
import { UsageTimeLeft } from './UsageTimeLeft'
import { UsageValueLine } from './UsageValueLine'
import r from '../resources.json'

const res = r as Record<string, string>

export function UsageWindowValue({
  provider,
  value,
  remaining = true,
}: {
  provider: string
  value: UsageWindow
  remaining?: boolean
}) {
  const name = usageWindowName(provider, value.window, res)
  const shown = remaining && value.usedPercent !== null ? Math.max(0, 100 - value.usedPercent) : value.usedPercent
  return (
    <UsageValueLine
      label={name}
      value={usagePercentText(shown, res.usageUnknownPercent)}
      timeLeft={<UsageTimeLeft label={name} startsAt={value.startsAt} resetsAt={value.resetsAt} />}
    />
  )
}
