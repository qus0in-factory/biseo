import type { UsageWindow } from '../domain/usage'
import { usagePercentText, usageWindowName } from '../domain/usage-text'
import { isResetPassed } from '../domain/usage-auth-state.js'
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
  const text = isResetPassed(value.resetsAt) ? res.usageUnconfirmed : usagePercentText(shown, res.usageUnknownPercent)
  return (
    <UsageValueLine
      label={name}
      value={text}
      timeLeft={<UsageTimeLeft label={name} startsAt={value.startsAt} resetsAt={value.resetsAt} remaining={remaining} />}
    />
  )
}
