import type { UsageWindow } from '../domain/usage'
import { usagePercentText, usageWindowName } from '../domain/usage-text'
import { UsageTimeLeft } from './UsageTimeLeft'
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
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{name}</span>
      <span className="font-mono text-xs">
        {usagePercentText(shown, res.usageUnknownPercent)}
        <UsageTimeLeft label={name} startsAt={value.startsAt} resetsAt={value.resetsAt} />
      </span>
    </div>
  )
}
